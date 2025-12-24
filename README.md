# Naxie - Framework-Agnostic AI Chat Component

A **truly framework-agnostic** AI chat component that works with React, Angular, Vue, jQuery, vanilla JavaScript, PHP, and any other frontend technology!

## ✨ Features

- 🎨 **Framework Agnostic** - Works with React, Angular, Vue, jQuery, vanilla JS, PHP, and more
- 🔌 **WebSocket Support** - Real-time messaging with configurable WebSocket endpoints
- 📝 **Markdown Rendering** - Full markdown support with syntax highlighting
- 🎯 **TypeScript** - Full type safety and IntelliSense support
- 🎨 **Customizable** - Styled with CSS (React version uses Tailwind)
- ⚡ **Lightweight** - Core services are framework-independent

## 📦 Installation

```bash
npm install @ishfaqqayoom/naxie
```

## 🚀 Quick Start

### React (Default - Backward Compatible)

```tsx
import { ChatComponent } from '@ishfaqqayoom/naxie';
import '@ishfaqqayoom/naxie/style.css';

function App() {
  return (
    <ChatComponent
      title="Chat with AI"
      placeholder="Ask a question..."
      apiConfig={{
        apiKey: 'your-api-key'
      }}
      websocketConfig={{
        endpoint: 'answer/ws',
        baseUrl: 'wss://your-server.com/api'
      }}
    />
  );
}
```

### Vanilla JavaScript (No Framework)

Perfect for HTML/PHP projects or any JavaScript environment! Modern browsers require an **Import Map** to resolve package names.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- 1. Import Naxie Styles -->
  <link rel="stylesheet" href="./node_modules/@ishfaqqayoom/naxie/dist/vanilla/style.css">
</head>
<body>
  <!-- 2. The container for our chat -->
  <div id="chat-container"></div>
  
  <!-- 3. Setup Import Map (Tells browser where @ishfaqqayoom/naxie/vanilla is) -->
  <script type="importmap">
    {
      "imports": {
        "@ishfaqqayoom/naxie/vanilla": "./node_modules/@ishfaqqayoom/naxie/dist/vanilla/index.mjs"
      }
    }
  </script>

  <!-- 4. Use Naxie -->
  <script type="module">
    import { NaxieVanilla } from '@ishfaqqayoom/naxie/vanilla';
    
    const chat = new NaxieVanilla(document.getElementById('chat-container'), {
      title: 'Chat with AI',
      placeholder: 'Ask a question...',
      apiConfig: {
        apiKey: 'your-api-key'
      },
      websocketConfig: {
        endpoint: 'answer/ws',
        baseUrl: 'wss://your-server.com/api'
      }
    });
  </script>
</body>
</html>
```

> [!IMPORTANT]
> Always run your HTML through a local web server (e.g., VS Code Live Server, `npx serve`) rather than opening the file directly, to avoid CORS and Module errors.

### Vue 3

```vue
<template>
  <NaxieChat 
    title="Chat with AI"
    :api-config="{ apiKey: 'your-api-key' }"
    :websocket-config="websocketConfig"
    @message-received="onMessage"
  />
</template>

<script setup>
import { NaxieChat } from '@ishfaqqayoom/naxie/vue';
import '@ishfaqqayoom/naxie/dist/vanilla/style.css';

const websocketConfig = {
  endpoint: 'answer/ws',
  baseUrl: 'wss://your-server.com/api'
};

const onMessage = (message) => {
  console.log('Received:', message);
};
</script>
```

### Angular

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { NaxieChatModule } from '@ishfaqqayoom/naxie/angular';

@NgModule({
  imports: [NaxieChatModule],
})
export class AppModule {}
```

```html
<!-- component.html -->
<naxie-chat
  [title]="'Chat with AI'"
  [apiConfig]="{ apiKey: 'your-api-key' }"
  [websocketConfig]="websocketConfig"
  (messageReceived)="onMessage($event)">
</naxie-chat>
```

```typescript
// component.ts
import '@ishfaqqayoom/naxie/dist/vanilla/style.css';

export class MyComponent {
  websocketConfig = {
    endpoint: 'answer/ws',
    baseUrl: 'wss://your-server.com/api'
  };
  
  onMessage(message: any) {
    console.log('Received:', message);
  }
}
```

### jQuery

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="node_modules/@ishfaqqayoom/naxie/dist/jquery/jquery.naxie.js"></script>
<link rel="stylesheet" href="node_modules/@ishfaqqayoom/naxie/dist/vanilla/style.css">

<div id="chat-container"></div>

<script>
  $('#chat-container').naxie({
    title: 'Chat with AI',
    placeholder: 'Ask a question...',
    apiConfig: {
      apiKey: 'your-api-key'
    },
    websocketConfig: {
      endpoint: 'answer/ws',
      baseUrl: 'wss://your-server.com/api'
    }
  });
</script>
```

### PHP (Static HTML with CDN)

```php
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@ishfaqqayoom/naxie/dist/vanilla.css">
</head>
<body>
  <div id="chat-container"></div>
  
  <script type="module">
    import { NaxieVanilla } from 'https://unpkg.com/@ishfaqqayoom/naxie/dist/vanilla/index.mjs';
    
    new NaxieVanilla(document.getElementById('chat-container'), {
      title: '<?php echo $chatTitle; ?>',
      apiConfig: {
        apiKey: '<?php echo $apiKey; ?>'
      },
      websocketConfig: {
        endpoint: 'answer/ws',
        baseUrl: 'wss://<?php echo $serverUrl; ?>/api'
      }
    });
  </script>
</body>
</html>
```

## 📚 API Documentation

### Common Options

All framework implementations support the same core options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `'Chat with Dashboard'` | Chat header title |
| `placeholder` | `string` | `'Ask a question'` | Input placeholder text |
| `apiConfig` | `object` | *required* | API configuration with `apiKey` and optional `baseUrl` |
| `websocketConfig` | `object` | See below | WebSocket configuration |
| `customData` | `object` | `{}` | Custom data to include in messages |
| `defaultOpen` | `boolean` | `false` | Whether chat is open by default |
| `showBubble` | `boolean` | `true` | Show/hide the chat bubble button |

### WebSocket Config (Default)

```javascript
{
  endpoint: 'answer/ws',
  baseUrl: 'wss://dev-api.cognax.ai/api'
}
```

### Events

All implementations emit the following events:

- `message-sent` - When a message is sent
- `message-received` - When a message is received
- `connection-opened` - When WebSocket connects
- `connection-closed` - When WebSocket disconnects
- `connection-error` - When connection error occurs
- `chat-opened` - When chat window opens
- `chat-closed` - When chat window closes
- `state-changed` - When internal state changes

## 🎯 Framework-Specific Features

### React
- Uses React hooks and components
- Tailwind CSS styling
- Full React ecosystem integration

### Vanilla JavaScript
- Pure JavaScript with no dependencies
- Standalone CSS
- Works in any HTML page

### Vue 3
- Composition API
- Vue 3 reactivity
- Proper event emitters

### Angular
- Angular components and modules
- Property binding and event emitters
- Angular dependency injection ready

### jQuery
- jQuery plugin interface
- Chainable API
- Compatible with existing jQuery code

## 🔧 Core Services (Advanced Usage)

For advanced use cases, you can import core services directly:

```typescript
import { NaxieCore, NaxieEvents } from '@ishfaqqayoom/naxie/core';

const core = new NaxieCore({
  apiConfig: { apiKey: 'your-api-key' },
  websocketConfig: { endpoint: 'answer/ws' }
});

core.on(NaxieEvents.MESSAGE_RECEIVED, (message) => {
  console.log('Received:', message);
});

core.connect();
core.sendMessage('Hello!');
```

## 🎨 Styling

### React Version
Uses Tailwind CSS. Add to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@ishfaqqayoom/naxie/dist/**/*.{js,ts,jsx,tsx}',
  ],
}
```

### Other Frameworks
Use the standalone CSS which doesn't require Tailwind:

```html
<link rel="stylesheet" href="@ishfaqqayoom/naxie/dist/vanilla/style.css">
```

## 📖 TypeScript Support

Naxie is written in TypeScript with full type definitions:

```typescript
import type { 
  ChatComponentProps,
  NaxieVanillaOptions, 
  WebSocketConfig,
  ChatState,
  NaxieCoreConfig
} from '@ishfaqqayoom/naxie/core';
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or PR on GitHub.

## 💬 Support

For issues and questions, please open an issue on [GitHub](https://github.com/ishfaqqayoom/naxie/issues).

---

Made with ❤️ by [Cognax](https://cognax.ai)
