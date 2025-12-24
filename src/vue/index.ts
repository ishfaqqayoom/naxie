// Vue 3 component (requires Vue to be installed)
// This file is only compiled when Vue dependencies are present

// Export a placeholder for when Vue is not installed
export const NaxieChat = null as any;

// Re-export types and events
export { NaxieEvents } from '../vanilla';
export type { NaxieCoreConfig, ChatState } from '../core';
