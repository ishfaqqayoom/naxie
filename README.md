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
npm install @ishfaqqayoom/naxie
```

### Prerequisites

Your project must have:
- React 18+
- Tailwind CSS configured

## Quick Start

### Basic Usage

```tsx
import { ChatComponent } from '@ishfaqqayoom/naxie';
import '@ishfaqqayoom/naxie/style.css';

function App() {
  return (
    <ChatComponent
      title="Chat with Naxie"
      placeholder="Ask a question about your data..."
      apiConfig={{
        apiKey: 'your-api-key'
      }}
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
    './node_modules/@ishfaqqayoom/naxie/dist/**/*.{js,ts,jsx,tsx}', // Add this line
  ],
  // ... rest of your config
}
```

## API Reference

### ChatComponentProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiConfig` | `{ apiKey: string; baseUrl?: string }` | - | API configuration. `baseUrl` defaults to `https://dev-api.cognax.ai/api`. |
| `websocketConfig` | `WebSocketConfig` | `{ endpoint: 'answer/ws', baseUrl: 'wss://dev-api.cognax.ai/api' }` | WebSocket configuration object. Defaults are pre-configured. |
| `title` | `string` | `'Chat with Dashboard'` | Chat header title |
| `placeholder` | `string` | `'Ask a question'` | Input placeholder text |
| `className` | `string` | `''` | Additional CSS classes |
| `defaultOpen` | `boolean` | `false` | Whether chat is open by default |
| `showBubble` | `boolean` | `true` | Show/hide the chat bubble button |
| `customData` | `Record<string, any>` | `{}` | Custom data to include in WebSocket messages |

## Custom Styling

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

## TypeScript Support

Naxie is written in TypeScript and includes full type definitions. Import types as needed:

```typescript
import type { 
  ChatComponentProps, 
  WebSocketConfig 
} from '@ishfaqqayoom/naxie';
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
