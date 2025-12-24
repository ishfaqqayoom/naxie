/**
 * Framework-agnostic chat state manager
 * Uses observable pattern for state subscriptions
 */
export interface ChatState {
  chatHistory: any[];
  isOpen: boolean;
  isMaximized: boolean;
  isConnected: boolean;
  isLoading: boolean;
  sessionId?: string;
  selectedModel: string;
  settings: {
    domain?: any;
    tags: any[];
    sensitivity: number;
    prompt: string;
  };
}

type StateListener = (state: ChatState) => void;

export class ChatStateManager {
  private state: ChatState;
  private listeners: Set<StateListener> = new Set();

  constructor(initialState: Partial<ChatState> = {}) {
    this.state = {
      chatHistory: [],
      isOpen: false,
      isMaximized: false,
      isConnected: false,
      isLoading: false,
      selectedModel: 'gpt-4',
      settings: {
        tags: [],
        sensitivity: 70,
        prompt: '',
      },
      ...initialState,
    };
  }

  /**
   * Get current state (immutable copy)
   */
  getState(): Readonly<ChatState> {
    return { ...this.state };
  }

  /**
   * Update state and notify listeners
   */
  setState(partialState: Partial<ChatState>): void {
    this.state = {
      ...this.state,
      ...partialState,
    };
    this.notifyListeners();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }

  /**
   * Add a message to chat history
   */
  addMessage(message: any): void {
    this.setState({
      chatHistory: [...this.state.chatHistory, message],
    });
  }

  /**
   * Update a message in chat history
   */
  updateMessage(index: number, message: any): void {
    const newHistory = [...this.state.chatHistory];
    newHistory[index] = message;
    this.setState({ chatHistory: newHistory });
  }

  /**
   * Clear chat history
   */
  clearHistory(): void {
    this.setState({ chatHistory: [] });
  }

  /**
   * Toggle chat visibility
   */
  toggleOpen(): void {
    this.setState({ isOpen: !this.state.isOpen });
  }

  /**
   * Toggle maximized state
   */
  toggleMaximized(): void {
    this.setState({ isMaximized: !this.state.isMaximized });
  }

  /**
   * Clean up
   */
  destroy(): void {
    this.listeners.clear();
  }
}
