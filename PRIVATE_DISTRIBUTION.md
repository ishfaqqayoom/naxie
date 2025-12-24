# Private Distribution Guide - Naxie Package

## For Authorized Users Only

This package is **privately distributed**. Follow the instructions below based on your project type.

---

## For HTML/Vanilla JavaScript Projects

Since this is a private package, you cannot use public CDN. Instead, use local files.

### Setup Steps

**1. Download the package files** (provided by package administrator)

You will receive:
```
naxie-vanilla/
├── naxie.mjs       (JavaScript module)
└── naxie.css       (Styles)
```

**2. Add to your project:**
```
your-project/
├── assets/
│   ├── naxie.mjs
│   └── naxie.css
└── index.html
```

**3. Use in your HTML:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
  <!-- Import CSS -->
  <link rel="stylesheet" href="assets/naxie.css">
</head>
<body>
  <div id="chat-container"></div>
  
  <!-- Import and use Naxie -->
  <script type="module">
    import { NaxieVanilla } from './assets/naxie.mjs';
    
    const chat = new NaxieVanilla(document.getElementById('chat-container'), {
      title: 'Chat Assistant',
      placeholder: 'Ask me anything...',
      apiConfig: {
        apiKey: 'your-api-key',
        baseUrl: 'https://dev-api.cognax.ai/api'
      },
      websocketConfig: {
        endpoint: 'answer/ws',
        baseUrl: 'wss://dev-api.cognax.ai/api'
      }
    });
  </script>
</body>
</html>
```

**4. Run with a local server:**
```bash
npx serve .
# or
python -m http.server 8000
```

---

## For React/Vue/Angular/Framework Projects

### Setup with GitHub Packages

**1. Create `.npmrc` in your project root:**
```
@ishfaqqayoom:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

**2. Install the package:**
```bash
npm install @ishfaqqayoom/naxie
```

**3. Use in your project:**

#### React
```tsx
import { ChatComponent } from '@ishfaqqayoom/naxie';
import '@ishfaqqayoom/naxie/style.css';

function App() {
  return (
    <ChatComponent
      title="Chat"
      apiConfig={{ apiKey: 'your-key' }}
    />
  );
}
```

#### Vue 3
```vue
<template>
  <NaxieChat title="Chat" :api-config="{ apiKey: 'your-key' }" />
</template>

<script setup>
import { NaxieChat } from '@ishfaqqayoom/naxie/vue';
import '@ishfaqqayoom/naxie/vanilla.css';
</script>
```

#### Angular
```typescript
import { NaxieChatModule } from '@ishfaqqayoom/naxie/angular';

@NgModule({
  imports: [NaxieChatModule]
})
```

---

## Getting Your GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `read:packages` permission
3. Copy the token
4. Add to `.npmrc` file as shown above

---

## Important Notes

- ⚠️ This package is private - do not share access tokens publicly
- ⚠️ For HTML projects, you must use local files (no CDN available)
- ⚠️ Always run HTML files through a web server (not file://)
- 💬 Contact package administrator for support or access issues

---

## Support

For questions or issues, contact: [Your Contact Info]
