// @ts-nocheck
/**
 * Angular component for Naxie
 * 
 * Note: Requires @angular/core and @angular/common to be installed
 * This file is excluded from TypeScript compilation (see tsconfig.json)
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { NaxieVanilla, NaxieVanillaOptions, NaxieEvents } from '../vanilla';

@Component({
  selector: 'naxie-chat',
  template: `<div #naxieContainer class="naxie-angular-wrapper"></div>`,
  styles: [
    `
      .naxie-angular-wrapper {
        /* Wrapper styling if needed */
      }
    `,
  ],
})
export class NaxieChatComponent implements AfterViewInit, OnDestroy {
  @ViewChild('naxieContainer', { static: true })
  containerRef!: ElementRef<HTMLDivElement>;

  @Input() title: string = 'Chat with Dashboard';
  @Input() placeholder: string = 'Ask a question';
  @Input() apiConfig!: { apiKey: string; baseUrl?: string };
  @Input() websocketConfig?: { endpoint: string; baseUrl?: string };
  @Input() customData?: Record<string, any>;
  @Input() defaultOpen: boolean = false;
  @Input() showBubble: boolean = true;

  @Output() messageSent = new EventEmitter<any>();
  @Output() messageReceived = new EventEmitter<any>();
  @Output() connectionOpened = new EventEmitter<void>();
  @Output() connectionClosed = new EventEmitter<void>();
  @Output() connectionError = new EventEmitter<any>();
  @Output() chatOpened = new EventEmitter<void>();
  @Output() chatClosed = new EventEmitter<void>();
  @Output() stateChanged = new EventEmitter<any>();

  private naxieInstance: NaxieVanilla | null = null;

  ngAfterViewInit(): void {
    this.initializeNaxie();
  }

  private initializeNaxie(): void {
    if (!this.containerRef?.nativeElement) return;

    const options: NaxieVanillaOptions = {
      title: this.title,
      placeholder: this.placeholder,
      apiConfig: this.apiConfig,
      websocketConfig: this.websocketConfig,
      customData: this.customData,
      defaultOpen: this.defaultOpen,
      showBubble: this.showBubble,
    };

    this.naxieInstance = new NaxieVanilla(
      this.containerRef.nativeElement,
      options
    );

    // Setup event listeners
    this.naxieInstance.on(NaxieEvents.MESSAGE_SENT, (message) => {
      this.messageSent.emit(message);
    });

    this.naxieInstance.on(NaxieEvents.MESSAGE_RECEIVED, (message) => {
      this.messageReceived.emit(message);
    });

    this.naxieInstance.on(NaxieEvents.CONNECTION_OPENED, () => {
      this.connectionOpened.emit();
    });

    this.naxieInstance.on(NaxieEvents.CONNECTION_CLOSED, () => {
      this.connectionClosed.emit();
    });

    this.naxieInstance.on(NaxieEvents.CONNECTION_ERROR, (error) => {
      this.connectionError.emit(error);
    });

    this.naxieInstance.on(NaxieEvents.CHAT_OPENED, () => {
      this.chatOpened.emit();
    });

    this.naxieInstance.on(NaxieEvents.CHAT_CLOSED, () => {
      this.chatClosed.emit();
    });

    this.naxieInstance.on(NaxieEvents.STATE_CHANGED, (state) => {
      this.stateChanged.emit(state);
    });
  }

  /**
   * Send a message programmatically
   */
  sendMessage(text: string): void {
    this.naxieInstance?.sendMessage(text);
  }

  /**
   * Open the chat
   */
  open(): void {
    this.naxieInstance?.open();
  }

  /**
   * Close the chat
   */
  close(): void {
    this.naxieInstance?.close();
  }

  /**
   * Toggle maximize
   */
  toggleMaximize(): void {
    this.naxieInstance?.toggleMaximize();
  }

  /**
   * Get current state
   */
  getState() {
    return this.naxieInstance?.getState();
  }

  ngOnDestroy(): void {
    if (this.naxieInstance) {
      this.naxieInstance.destroy();
      this.naxieInstance = null;
    }
  }
}
