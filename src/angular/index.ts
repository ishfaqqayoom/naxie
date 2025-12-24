// Angular component (requires @angular/core and @angular/common to be installed)
// This file is only compiled when Angular dependencies are present

// @ts-nocheck
export { NaxieChatComponent } from './naxie-chat.component';
export { NaxieChatModule } from './naxie-chat.module';

// Re-export types and events
export { NaxieEvents } from '../vanilla';
export type { NaxieCoreConfig, ChatState } from '../core';
