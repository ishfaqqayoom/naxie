# Naxie

A reusable, AI-powered chat bubble component for React applications with WebSocket support and beautiful UI.

## Features

- 🎨 **Beautiful UI** - Modern, responsive chat interface with animations
- 🔌 **WebSocket Support** - Real-time messaging with configurable WebSocket endpoints
- 🎯 **Flexible Integration** - Use with WebSocket or custom message handlers
- 📝 **Markdown Rendering** - Full markdown support with syntax highlighting
- 🎭 **TypeScript** - Full type safety and IntelliSense support
- 🎨 **Customizable** - Tailwind CSS for easy styling customization
- 📊 **Table Support** - Render data tables in chat responses

## Installation

```bash
npm install naxie
```

### Prerequisites

Your project must have:
- React 18+
- Tailwind CSS configured

## Quick Start

### Basic Usage with WebSocket

```tsx
import { ChatComponent } from 'naxie';
import 'naxie/dist/style.css';

function App() {
  return (
    <ChatComponent
      websocketConfig={{
        endpoint: 'chat',
        baseUrl: 'wss://your-api.com',
        onConnect: () => console.log('Connected'),
        onDisconnect: () => console.log('Disconnected'),
      }}
      title="AI Assistant"
      placeholder="Ask me anything..."
    />
  );
}
```

### Controlled Mode (Custom Message Handling)

```tsx
import { ChatComponent, Message } from 'naxie';
import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { 
      sendMessage: message, 
      receivedMessage: '' 
    }]);

    // Call your API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    const data = await response.json();

    // Update with response
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1].receivedMessage = data.response;
      return updated;
    });
  };

  return (
    <ChatComponent
      messages={messages}
      onSendMessage={handleSendMessage}
      title="Custom Chat"
    />
  );
}
```

## Tailwind Configuration

Add the package path to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/naxie/dist/**/*.{js,ts,jsx,tsx}', // Add this line
  ],
  // ... rest of your config
}
```

## API Reference

### ChatComponentProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `websocketConfig` | `WebSocketConfig` | - | WebSocket configuration object |
| `messages` | `Message[]` | - | Controlled mode: array of messages |
| `onSendMessage` | `(message: string) => Promise<void>` | - | Controlled mode: message send handler |
| `onMessageReceived` | `(message: Message) => void` | - | Callback when message is received |
| `title` | `string` | `'Chat with Dashboard'` | Chat header title |
| `placeholder` | `string` | `'Ask a question'` | Input placeholder text |
| `className` | `string` | `''` | Additional CSS classes |
| `defaultOpen` | `boolean` | `false` | Whether chat is open by default |
| `showBubble` | `boolean` | `true` | Show/hide the chat bubble button |
| `customData` | `Record<string, any>` | `{}` | Custom data to include in WebSocket messages |

### WebSocketConfig

```typescript
interface WebSocketConfig {
  endpoint: string;           // WebSocket endpoint (e.g., 'chat')
  baseUrl?: string;          // Base URL (e.g., 'wss://api.example.com')
  onConnect?: () => void;    // Connection callback
  onDisconnect?: () => void; // Disconnection callback
  onError?: (error: Event) => void; // Error callback
}
```

### Message

```typescript
interface Message {
  sendMessage: string;      // User's message
  receivedMessage: string;  // AI/Server response
  refs?: any;              // Optional references for links
}
```

## Advanced Usage

### Using WebSocket Service Directly

```typescript
import { createWebSocketService } from 'naxie';

const wsService = createWebSocketService({
  endpoint: 'chat',
  baseUrl: 'wss://your-api.com',
  onConnect: () => console.log('Connected'),
});

// Connect
wsService.connect();

// Send message
wsService.send({ message: 'Hello' });

// Add message handler
wsService.addMessageHandler((data) => {
  console.log('Received:', data);
});

// Disconnect
wsService.disconnect();
```

### Custom Styling

The component uses Tailwind CSS. You can override styles by:

1. **Using className prop**:
```tsx
<ChatComponent className="bottom-8 right-8" />
```

2. **Customizing Tailwind theme** in your `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
}
```

## Message Format

### Text Response
```json
{
  "sendMessage": "What is the weather?",
  "receivedMessage": "The weather is sunny today."
}
```

### Table Response
```json
{
  "sendMessage": "Show me sales data",
  "receivedMessage": "{\"columns\":[\"Product\",\"Sales\"],\"rows\":[[\"A\",100],[\"B\",200]]}"
}
```

### Error Response
```json
{
  "sendMessage": "Invalid query",
  "receivedMessage": "{\"status_code\":400,\"message\":\"Error message\"}"
}
```

## Examples

Check out the `examples/` directory for complete working examples:
- Basic WebSocket integration
- Custom message handlers
- Styling customization

## TypeScript Support

Naxie is written in TypeScript and includes full type definitions. Import types as needed:

```typescript
import type { 
  ChatComponentProps, 
  Message, 
  WebSocketConfig 
} from 'naxie';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
