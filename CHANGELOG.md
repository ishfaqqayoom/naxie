# Naxie v1.1.1 - Vanilla CSS Fixes

## 🎉 Improvements
- 🎨 **Vanilla CSS Fixes**: Added missing CSS classes for dropdowns, dialogs, maximized states, and animations in the vanilla implementation.
- 📦 **Rebuilt Distribution**: Ensured `dist-vanilla` and `dist-package` are fully styled and ready for use in non-React environments.

# Naxie v1.1.0 - Framework-Agnostic Release!

## 🎉 New Features

### Framework-Agnostic Support
Naxie is now **truly framework-agnostic**! Use it with:
- ✅ **React** (existing, backward compatible)
- ✅ **Vanilla JavaScript** (NEW - no framework needed!)
- ✅ **Vue 3** (NEW)
- ✅ **Angular** (NEW)
- ✅ **jQuery** (NEW)
- ✅ **PHP/Static HTML** (NEW)

### New Package Exports

```javascript
// React (default - backward compatible)
import { ChatComponent } from '@ishfaqqayoom/naxie';

// Vanilla JavaScript
import { NaxieVanilla } from '@ishfaqqayoom/naxie/vanilla';

// Vue 3
import { NaxieChat } from '@ishfaqqayoom/naxie/vue';

// Angular
import { NaxieChatModule } from '@ishfaqqayoom/naxie/angular';

// jQuery
import '@ishfaqqayoom/naxie/jquery';

// Core services (advanced)
import { NaxieCore } from '@ishfaqqayoom/naxie/core';
```

### Core Services Layer
- Framework-independent core logic
- Event-driven architecture
- Observable state management
- WebSocket service (already framework-agnostic)

## 🔄 Breaking Changes

**NONE!** This is a minor version bump (1.1.0) because:
- Existing React users: **No changes needed**
- Same API as before for React
- New features are additive only

## 📦 What's Included

### For React Users (Existing)
- No changes required
- Same imports and API
- Continues to use Tailwind CSS

### For Non-React Users (NEW)
- Vanilla JavaScript implementation with standalone CSS
- Vue 3 component with Composition API
- Angular component with module
- jQuery plugin
- PHP/static HTML support via vanilla version

## 🚀 Migration Guide

### From v1.0.x to v1.1.0 (React Users)

**No migration needed!** Your existing code continues to work:

```tsx
// This still works exactly as before
import { ChatComponent } from '@ishfaqqayoom/naxie';
import '@ishfaqqayoom/naxie/style.css';

<ChatComponent
  title="Chat"
  apiConfig={{ apiKey: 'xxx' }}
/>
```

### New Users

Choose your framework and import the appropriate module. See README.md for detailed examples.

## 📝 Full Changelog

### Added
- Core services layer (`@ishfaqqayoom/naxie/core`)
- Vanilla JavaScript implementation (`@ishfaqqayoom/naxie/vanilla`)
- Vue 3 component (`@ishfaqqayoom/naxie/vue`)
- Angular component and module (`@ishfaqqayoom/naxie/angular`)
- jQuery plugin (`@ishfaqqayoom/naxie/jquery`)
- Framework-agnostic event system
- Standalone CSS for non-React frameworks
- Multi-entry point package exports

### Changed
- React dependencies are now optional (peerDependenciesMeta)
- Updated package description
- Added framework-related keywords

### Developer Experience
- Better TypeScript support for all frameworks
- Improved  documentation with examples for each framework
- Clear separation of concerns (core vs UI)

## 🎯 Usage Examples

See [README.md](./README.md) for detailed usage examples for:
- React
- Vanilla JavaScript
- Vue 3
- Angular
- jQuery
- PHP

---

**Note**: The React version remains the default export for backward compatibility.
