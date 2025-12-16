// Main component
export { ChatComponent, default as default } from './components/chat-bubble';

// Types
export type {
  ChatComponentProps,
  Message,
  WebSocketConfig,
  InputChatProps,
  ChatBubbleListProps,
} from './types';

// Services (for advanced users)
export {
  createWebSocketService,
  connectToWebSocket,
  disconnectWebSocket,
  sendMessage,
  addMessageHandler,
  removeMessageHandler,
  isWebSocketOpen,
} from './services/socket';

// Utilities
export { cn } from './lib/utils';

// Styles
import './styles/index.css';
