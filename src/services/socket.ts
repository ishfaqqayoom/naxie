import { WebSocketConfig } from '../types';

let socket: WebSocket | null = null;
const messageHandlers: ((data: any) => void)[] = [];
const closeHandlers: (() => void)[] = [];

/**
 * Create and configure a WebSocket service
 * @param config WebSocket configuration
 * @returns WebSocket service functions
 */
export const createWebSocketService = (config: WebSocketConfig) => {
  
  return {
    connect: () => connectToWebSocket(config),
    disconnect: disconnectWebSocket,
    send: sendMessage,
    addMessageHandler,
    removeMessageHandler,
    addCloseHandler,
    removeCloseHandler,
    isOpen: isWebSocketOpen,
    getInstance: getWebSocketInstance
  };
};

/**
 * Connect to WebSocket server
 * @param config WebSocket configuration
 */
export const connectToWebSocket = (config: WebSocketConfig) => {
  const baseURL = config.baseUrl || '';
  const socketServerUrl = baseURL ? `${baseURL}/${config.endpoint}` : config.endpoint;
  
  if (socket) {
    console.warn('WebSocket is already connected.');
    return;
  }

  socket = new WebSocket(socketServerUrl);

  socket.addEventListener('open', () => {
    console.log('Connected to the WebSocket server');
    config.onConnect?.();
  });

  socket.addEventListener('message', (event) => {
    const data = event?.data;
    messageHandlers.forEach((handler) => handler(data));
  });

  socket.addEventListener('close', () => {
    console.log('WebSocket connection closed');
    config.onDisconnect?.();
    // Call registered close handlers
    closeHandlers.forEach((handler) => handler());
    // Reset the socket instance
    socket = null;
  });

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    config.onError?.(error);
  });
};

/**
 * Disconnect from WebSocket server
 */
export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    console.log('WebSocket disconnected');
  }
};

/**
 * Send a message through WebSocket
 * @param message Message to send (will be JSON stringified)
 */
export const sendMessage = (message: any) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn('WebSocket is not open. Cannot send message.');
  }
};

/**
 * Get the current WebSocket instance
 * @returns WebSocket instance or null
 */
export const getWebSocketInstance = () => socket;

/**
 * Add a message handler
 * @param handler Function to handle incoming messages
 */
export const addMessageHandler = (handler: (data: any) => void) => {
  if (!messageHandlers.includes(handler)) {
    messageHandlers.push(handler);
  }
};

/**
 * Remove a message handler
 * @param handler Function to remove
 */
export const removeMessageHandler = (handler: (data: any) => void) => {
  const index = messageHandlers.indexOf(handler);
  if (index !== -1) {
    messageHandlers.splice(index, 1);
  }
};

/**
 * Add a close handler
 * @param handler Function to call when connection closes
 */
export const addCloseHandler = (handler: () => void) => {
  if (!closeHandlers.includes(handler)) {
    closeHandlers.push(handler);
  }
};

/**
 * Remove a close handler
 * @param handler Function to remove
 */
export const removeCloseHandler = (handler: () => void) => {
  const index = closeHandlers.indexOf(handler);
  if (index !== -1) {
    closeHandlers.splice(index, 1);
  }
};

/**
 * Check if WebSocket is currently open
 * @returns true if WebSocket is open, false otherwise
 */
export const isWebSocketOpen = () => socket && socket.readyState === WebSocket.OPEN;
