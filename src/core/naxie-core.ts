import { ChatStateManager } from './chat-state';
import { EventEmitter, NaxieEvents } from './event-emitter';
import { createWebSocketService } from '../services/socket';
import { WebSocketConfig } from '../types';

/**
 * Core configuration for Naxie
 */
export interface NaxieCoreConfig {
  apiConfig: {
    apiKey: string;
    baseUrl?: string;
  };
  websocketConfig?: WebSocketConfig;
  customData?: Record<string, any>;
  defaultOpen?: boolean;
}

/**
 * Framework-agnostic core Naxie functionality
 * This class contains all business logic without any UI framework dependencies
 */
export class NaxieCore {
  private stateManager: ChatStateManager;
  private eventEmitter: EventEmitter;
  private wsService: ReturnType<typeof createWebSocketService> | null = null;
  private config: NaxieCoreConfig;

  constructor(config: NaxieCoreConfig) {
    // If apiConfig.baseUrl is missing, try to use websocketConfig.baseUrl as fallback
    // and transform wss:// to https:// (or ws:// to http://)
    if (!config.apiConfig.baseUrl && config.websocketConfig?.baseUrl) {
      config.apiConfig.baseUrl = config.websocketConfig.baseUrl
        .replace(/^wss:\/\//i, 'https://')
        .replace(/^ws:\/\//i, 'http://');
    }

    this.config = config;
    this.stateManager = new ChatStateManager({
      isOpen: config.defaultOpen || false,
    });
    this.eventEmitter = new EventEmitter();

    // Initialize WebSocket if config provided
    if (config.websocketConfig) {
      this.initializeWebSocket(config.websocketConfig);
    }

    // Emit state changes
    this.stateManager.subscribe((state) => {
      this.eventEmitter.emit(NaxieEvents.STATE_CHANGED, state);
    });
  }

  /**
   * Initialize WebSocket connection
   */
  private initializeWebSocket(wsConfig: WebSocketConfig): void {
    const config: WebSocketConfig = {
      ...wsConfig,
      onConnect: () => {
        this.stateManager.setState({ isConnected: true });
        this.eventEmitter.emit(NaxieEvents.CONNECTION_OPENED);
        wsConfig.onConnect?.();
      },
      onDisconnect: () => {
        this.stateManager.setState({ isConnected: false });
        this.eventEmitter.emit(NaxieEvents.CONNECTION_CLOSED);
        wsConfig.onDisconnect?.();
      },
      onError: (error: any) => {
        this.eventEmitter.emit(NaxieEvents.CONNECTION_ERROR, error);
        wsConfig.onError?.(error);
      },
    };

    this.wsService = createWebSocketService(config);

    // Handle incoming messages
    this.wsService.addMessageHandler((data) => {
      this.handleIncomingMessage(data);
    });
  }

  /**
   * Connect to WebSocket
   */
  connect(): void {
    if (this.wsService) {
      this.wsService.connect();
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.wsService) {
      this.wsService.disconnect();
    }
  }

  /**
   * Send a message
   */
  sendMessage(text: string, additionalData?: Record<string, any>): void {
    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    this.stateManager.addMessage(userMessage);
    this.eventEmitter.emit(NaxieEvents.MESSAGE_SENT, userMessage);

    // Send via WebSocket if available
    if (this.wsService && this.wsService.isOpen()) {
      const state = this.stateManager.getState();
      const payload = {
        user_query: text,
        session_id: state.sessionId,
        ...this.config.customData,
        ...additionalData,
      };
      this.wsService.send(payload);
      this.stateManager.setState({ isLoading: true });
    }
  }

  /**
   * Regenerate the last AI response
   */
  regenerate(): void {
    const state = this.stateManager.getState();
    const history = state.chatHistory;
    
    // Find last user message
    let lastUserMessageIdx = -1;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].role === 'user') {
        lastUserMessageIdx = i;
        break;
      }
    }

    if (lastUserMessageIdx === -1) return;

    // Remove all messages after the last user message
    const newHistory = history.slice(0, lastUserMessageIdx + 1);
    this.stateManager.setState({ chatHistory: newHistory });

    const lastUserMessage = newHistory[lastUserMessageIdx];
    
    // Re-send the message
    if (this.wsService && this.wsService.isOpen()) {
      const payload = {
        user_query: lastUserMessage.content,
        session_id: state.sessionId,
        ...this.config.customData,
      };
      this.wsService.send(payload);
      this.stateManager.setState({ isLoading: true });
    }
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleIncomingMessage(data: any): void {
    let parsed: any = null;
    
    // Debug logging
    console.log('[Naxie Debug] Received message:', data);
    
    try {
      if (typeof data === 'string') {
        const trimmed = data.trim();
        
        
        // Handle EOF (End of stream) - check if EOF is present anywhere in the message
        if (trimmed.includes('EOF')) {
          console.log('[Naxie Debug] EOF detected! Stopping loader...');
          // If there's content before EOF, process it first
          const eofIndex = trimmed.indexOf('EOF');
          if (eofIndex > 0) {
            const contentBeforeEOF = trimmed.substring(0, eofIndex).trim();
            if (contentBeforeEOF) {
              console.log('[Naxie Debug] Processing content before EOF:', contentBeforeEOF);
              this.handleTextChunk(contentBeforeEOF);
            }
          }
          // Stop the loader
          this.stateManager.setState({ isLoading: false });
          console.log('[Naxie Debug] Loader stopped, isLoading set to false');
          return;
        }

        // Try to parse JSON
        try {
          parsed = JSON.parse(data);
          console.log('[Naxie Debug] Parsed JSON:', parsed);
          
          // Handle session_id initialization
          if (parsed && parsed.session_id && !this.stateManager.getState().sessionId) {
            console.log('[Naxie Debug] Setting session_id:', parsed.session_id);
            this.stateManager.setState({ sessionId: parsed.session_id });
            return;
          }

          // Handle keepalive
          // if (parsed && parsed.type === 'keepalive') {
          //   console.log('[Naxie Debug] Received keepalive, sending response');
          //   if (this.wsService && this.wsService.isOpen()) {
          //     this.wsService.send({ type: 'keepalive' });
          //   }
          //   return;
          // }
        } catch {
          // Not JSON - treat as raw text chunk
          console.log('[Naxie Debug] Not JSON, treating as text chunk');
          this.handleTextChunk(data);
          return;
        }
      } else {
        parsed = data;
      }
      
      if (!parsed) return;

      // Handle different message types from JSON
      if (parsed.type === 'answer' || parsed.content || parsed.answer) {
        const aiMessage = {
          role: 'assistant',
          content: parsed.content || parsed.answer || '',
          timestamp: new Date().toISOString(),
          ...parsed,
        };

        this.stateManager.addMessage(aiMessage);
        this.eventEmitter.emit(NaxieEvents.MESSAGE_RECEIVED, aiMessage);
        this.stateManager.setState({ isLoading: false });
      } else if (parsed.refs !== undefined || parsed.web_search !== undefined) {
        // Handle metadata messages (refs, web_search) that come after EOF
        console.log('[Naxie Debug] Received metadata message, ensuring loader is off');
        // These messages come after the response is complete, ensure loader stays off
        this.stateManager.setState({ isLoading: false });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      this.stateManager.setState({ isLoading: false });
    }
  }

  /**
   * Handle raw text chunks (streaming response)
   */
  private handleTextChunk(text: string): void {
    const state = this.stateManager.getState();
    const history = state.chatHistory;
    const lastMsg = history.length > 0 ? history[history.length - 1] : null;

    // If last message is assistant, append to it
    if (lastMsg && lastMsg.role === 'assistant') {
      const updatedMsg = {
        ...lastMsg,
        content: lastMsg.content + text,
      };
      this.stateManager.updateMessage(history.length - 1, updatedMsg);
      this.eventEmitter.emit(NaxieEvents.MESSAGE_RECEIVED, updatedMsg);
    } 
    // Otherwise, create a new assistant message
    else {
      const newMsg = {
        role: 'assistant',
        content: text,
        timestamp: new Date().toISOString(),
      };
      this.stateManager.addMessage(newMsg);
      this.eventEmitter.emit(NaxieEvents.MESSAGE_RECEIVED, newMsg);
    }
  }

  /**
   * Get current state
   */
  getState() {
    return this.stateManager.getState();
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(callback: (state: any) => void) {
    return this.stateManager.subscribe(callback);
  }

  /**
   * Subscribe to events
   */
  on(event: string, callback: (...args: any[]) => void) {
    return this.eventEmitter.on(event, callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event: string, callback: (...args: any[]) => void) {
    this.eventEmitter.off(event, callback);
  }

  /**
   * Toggle chat open/closed
   */
  toggleOpen(): void {
    const newState = !this.stateManager.getState().isOpen;
    this.stateManager.toggleOpen();
    this.eventEmitter.emit(
      newState ? NaxieEvents.CHAT_OPENED : NaxieEvents.CHAT_CLOSED
    );
  }

  /**
   * Toggle maximized state
   */
  toggleMaximized(): void {
    this.stateManager.toggleMaximized();
  }

  /**
   * Set the selected model
   */
  setSelectedModel(modelName: string): void {
    this.stateManager.setState({ selectedModel: modelName });
  }

  /**
   * Update chat settings
   */
  updateSettings(settings: any): void {
    const currentState = this.stateManager.getState().settings;
    this.stateManager.setState({
      settings: { ...currentState, ...settings }
    });
  }

  /**
   * Clear chat history
   */
  clearHistory(): void {
    this.stateManager.clearHistory();
  }

  /**
   * Fetch available models from API
   */
  async fetchModels(): Promise<any[]> {
    if (!this.config.apiConfig.apiKey) return [];
    
    try {
      const response = await fetch(`${this.config.apiConfig.baseUrl || ''}/naxie/naxie-models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.models || [];
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
    return [];
  }

  /**
   * Fetch settings options (domains, tags, prompts)
   */
  async fetchSettingsOptions(): Promise<{ domains: any[], tags: any[], prompts: any[] }> {
    const results = { domains: [], tags: [], prompts: [] };
    if (!this.config.apiConfig.apiKey) return results;

    const headers = {
      'Authorization': `Bearer ${this.config.apiConfig.apiKey}`,
      'Content-Type': 'application/json',
    };

    try {
      const [domainsRes, tagsRes, promptsRes] = await Promise.all([
        fetch(`${this.config.apiConfig.baseUrl || ''}/domain?page_number=1&page_size=100`, { headers }),
        fetch(`${this.config.apiConfig.baseUrl || ''}/tag?page_number=1&page_size=100`, { headers }),
        fetch(`${this.config.apiConfig.baseUrl || ''}/prompts?page_number=1&page_size=100`, { headers })
      ]);

      if (domainsRes.ok) {
        const data = await domainsRes.json();
        results.domains = data?.data?.domains || [];
      }
      if (tagsRes.ok) {
        const data = await tagsRes.json();
        results.tags = data?.data?.tags || [];
      }
      if (promptsRes.ok) {
        const data = await promptsRes.json();
        results.prompts = data?.data?.prompts || [];
      }
    } catch (error) {
      console.error('Error fetching settings options:', error);
    }

    return results;
  }

  /**
   * Handle file upload
   */
  async uploadFiles(files: File[]): Promise<void> {
    if (!this.config.apiConfig.apiKey) throw new Error('API Key missing');

    const formData = new FormData();
    files.forEach(file => formData.append('documents', file));

    const response = await fetch(`${this.config.apiConfig.baseUrl || ''}/document/instant_upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiConfig.apiKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.disconnect();
    this.stateManager.destroy();
    this.eventEmitter.removeAllListeners();
  }
}
