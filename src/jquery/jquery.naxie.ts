/**
 * jQuery plugin for Naxie
 * Provides jQuery-style API for the chat component
 * 
 * Note: jQuery must be loaded before this plugin
 */

import { NaxieVanilla, NaxieVanillaOptions } from '../vanilla';

// Declare jQuery types (optional dependency)
declare const jQuery: any;
declare const window: any;
declare const globalThis: any;

declare global {
  interface JQuery {
    naxie(options?: NaxieVanillaOptions | string, ...args: any[]): JQuery;
  }
}

(function ($: any) {
  // Only initialize if $ is available
  if (!$) {
    console.warn('jQuery is not loaded. Naxie jQuery plugin requires jQuery to be loaded first.');
    return;
  }

  $.fn.naxie = function (options?: NaxieVanillaOptions | string, ...args: any[]) {
    return this.each(function (this: HTMLElement) {
      const $el = $(this);
      let instance = $el.data('naxie') as NaxieVanilla | undefined;

      // Method call
      if (typeof options === 'string') {
        if (!instance) {
          console.warn('Naxie not initialized');
          return;
        }

        const method = options as keyof NaxieVanilla;
        if (typeof instance[method] === 'function') {
          (instance[method] as any)(...args);
        }
        return;
      }

      // Initialize
      if (!instance && options && typeof options === 'object') {
        instance = new NaxieVanilla(this, options);
        $el.data('naxie', instance);
      }
    });
  };

  // Expose events
  $.naxie = {
    events: {
      MESSAGE_SENT: 'message:sent',
      MESSAGE_RECEIVED: 'message:received',
      CONNECTION_OPENED: 'connection:opened',
      CONNECTION_CLOSED: 'connection:closed',
      CONNECTION_ERROR: 'connection:error',
      CHAT_OPENED: 'chat:opened',
      CHAT_CLOSED: 'chat:closed',
    },
  };
})(
  typeof jQuery !== 'undefined' 
    ? jQuery 
    : typeof (globalThis as any)?.jQuery !== 'undefined'
    ? (globalThis as any).jQuery
    : typeof (window as any)?.jQuery !== 'undefined'
    ? (window as any).jQuery
    : null
);

export {};
