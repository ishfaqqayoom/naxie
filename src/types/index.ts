/**
 * Message structure for chat conversations
 */
export interface Message {
  /** The message sent by the user */
  sendMessage: string;
  /** The response received from the AI/backend */
  receivedMessage: string;
  /** Optional references for links and citations */
  refs?: any;
}

/**
 * WebSocket configuration options
 */
export interface WebSocketConfig {
  /** WebSocket endpoint URL (e.g., 'dashboard/chat') */
  endpoint: string;
  /** Base URL for WebSocket connection (optional, defaults to env variable) */
  baseUrl?: string;
  /** Callback when WebSocket connection is established */
  onConnect?: () => void;
  /** Callback when WebSocket connection is closed */
  onDisconnect?: () => void;
  /** Callback when WebSocket error occurs */
  onError?: (error: Event) => void;
}

/**
 * API configuration options
 */
export interface ApiConfig {
    /** HTTP base URL (e.g. https://api.cognax.ai/api) */
    baseUrl?: string;
    /** API Key for authorization */
    apiKey: string;
}

/**
 * Props for the main ChatComponent
 */
export interface ChatComponentProps {
  /** WebSocket configuration for real-time messaging */
  websocketConfig?: WebSocketConfig;
  
  /** Controlled mode: provide messages array */
  messages?: Message[];
  
  /** Controlled mode: callback when user sends a message */
  onSendMessage?: (message: string) => Promise<void>;
  
  /** Controlled mode: callback when a message is received */
  onMessageReceived?: (message: Message) => void;
  
  /** Title displayed in the chat header */
  title?: string;
  
  /** Placeholder text for the input field */
  placeholder?: string;
  
  /** Additional CSS classes for the chat container */
  className?: string;
  
  /** Whether the chat should be open by default */
  defaultOpen?: boolean;
  
  /** Show/hide the chat bubble button */
  showBubble?: boolean;
  
  /** Custom data to pass to WebSocket messages */
  customData?: Record<string, any>;
  
  /** API configuration for HTTP requests */
  apiConfig?: ApiConfig;
}

/**
 * Props for the InputChat component
 */
export interface InputChatProps {
  /** Callback when user sends a message */
  onSendMessage: (message: string) => void;
  /** Whether the chat is in loading state */
  isLoading?: boolean;
  /** Placeholder text for input */
  placeholder?: string;
  /** Whether input is disabled */
  disabled?: boolean;
    /** API configuration for HTTP requests */
  apiConfig?: ApiConfig;
}

/**
 * Props for the ChatBubbleList component
 */
export interface ChatBubbleListProps {
  /** Array of chat messages to display */
  chatHistory: Message[];
  /** Callback when user copies a message */
  onCopyMessage?: (message: string) => void;
  /** Callback when user requests to regenerate a message */
  onRegenerateMessage?: (messageId: string) => void;
}
