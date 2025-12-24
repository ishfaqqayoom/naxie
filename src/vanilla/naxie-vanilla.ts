import { NaxieCore, NaxieCoreConfig, NaxieEvents } from '../core';
import { marked } from 'marked';

/**
 * Vanilla JavaScript implementation of Naxie
 * Can be used in any HTML/JavaScript project without frameworks
 */
export interface NaxieVanillaOptions extends NaxieCoreConfig {
  title?: string;
  placeholder?: string;
  showBubble?: boolean;
}

// SVG Icons
const ICONS = {
  MESSAGE: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  CLOSE: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  MAXIMIZE: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`,
  MINIMIZE: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>`,
  SEND: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
  COPY: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  REGEN: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  WEB: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
DEEP: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44"/>
<path d="m13.56 11.747 4.332-.924"/>
<path d="m16 21-3.105-6.21"/>
<path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z"/>
<path d="m6.158 8.633 1.114 4.456"/>
<path d="m8 21 3.105-6.21"/>
<circle cx="12" cy="13" r="2"/>
</svg>`,
  SEARCH:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>`,
  NAXIE: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>`,
  SPARKLES: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.91 5.89L20 10.8l-5.91 1.91L12 18.6l-1.91-5.89L4 10.8l5.91-1.91L12 3z"></path></svg>`,
  SETTINGS: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  PLUS: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  UPLOAD: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  UNDO: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 6.7 6.7 0 0 0-5 2.5L3 13"></path></svg>`,
  USER: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  FILE_MINUS: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>`
};

export class NaxieVanilla {
  private core: NaxieCore;
  private container: HTMLElement;
  private options: NaxieVanillaOptions;
  private chatWindow: HTMLElement | null = null;
  private chatBubble: HTMLElement | null = null;
  
  // Cache for options
  private availableModels: any[] = [];
  private settingsOptions: any = { domains: [], tags: [], prompts: [] };
  
  // Feature states
  private webSearch: boolean = false;
  private deepSearch: boolean = false;

  constructor(container: HTMLElement | string, options: NaxieVanillaOptions) {
    if (typeof container === 'string') {
      const element = document.querySelector(container);
      if (!element) throw new Error(`Container "${container}" not found`);
      this.container = element as HTMLElement;
    } else {
      this.container = container;
    }

    this.options = {
      title: 'Chat with Dashboard',
      placeholder: 'Ask a question',
      showBubble: true,
      ...options,
    };

    this.core = new NaxieCore(options);
    this.render();
    this.setupEventListeners();

    if (options.websocketConfig) {
      this.core.connect();
    }

    // Lazy fetch options
    this.initOptions();
  }

  private async initOptions() {
    this.availableModels = await this.core.fetchModels();
    this.settingsOptions = await this.core.fetchSettingsOptions();
  }

  private render(): void {
    this.container.classList.add('naxie-container');

    if (this.options.showBubble) {
      this.chatBubble = this.createChatBubble();
      this.container.appendChild(this.chatBubble);
    }

    this.chatWindow = this.createChatWindow();
    this.container.appendChild(this.chatWindow);

    // Initial message update
    this.updateMessages();
  }

  private createChatBubble(): HTMLElement {
    const bubble = document.createElement('button');
    bubble.className = 'naxie-chat-bubble';
    bubble.innerHTML = ICONS.MESSAGE;
    bubble.addEventListener('click', () => this.open());
    return bubble;
  }

  private createChatWindow(): HTMLElement {
    const window = document.createElement('div');
    window.className = 'naxie-chat-window';
    const state = this.core.getState();

    window.innerHTML = `
      <div class="naxie-chat-header">
        <h3 class="naxie-chat-title">${this.options.title}</h3>
        <div class="naxie-chat-actions" style="display:flex">
          <button class="naxie-btn-maximize" title="Maximize">${ICONS.MAXIMIZE}</button>
          <button class="naxie-btn-close" title="Close">${ICONS.CLOSE}</button>
        </div>
      </div>
      <div class="naxie-chat-body">
        <div class="naxie-messages"></div>
      </div>
      <div class="naxie-chat-footer">
        <div class="naxie-input-card">
          <div class="naxie-relative-wrapper">
            <div class="naxie-search-icon">${ICONS.SEARCH}</div>
            <textarea 
              class="naxie-textarea" 
              placeholder="${this.options.placeholder}"
              rows="1"
            ></textarea>
            <div class="naxie-send-wrapper">
              <button class="naxie-btn-send" title="Send message">
                ${ICONS.SEND}
              </button>
            </div>
          </div>
          <div class="naxie-toolbar-container">
            <div class="naxie-toolbar-group">
              <div class="naxie-popover-anchor" style="position:relative">
                <button class="naxie-toggle naxie-toggle--model" style="min-width: 80px;">
                  <span class="naxie-toggle-icon">${ICONS.SPARKLES}</span>
                  <span class="naxie-model-name" style="max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${state.selectedModel}</span>
                </button>
                <div class="naxie-dropdown naxie-dropdown--models"></div>
              </div>
              <button class="naxie-toggle naxie-toggle--web" title="Web Search">
                <span class="naxie-toggle-icon">${ICONS.WEB}</span>
              </button>
              <button class="naxie-toggle naxie-toggle--deep" title="Deep Search">
                <span class="naxie-toggle-icon">${ICONS.DEEP}</span>
              </button>
              <div class="naxie-popover-anchor" style="position:relative">
                <button class="naxie-toggle naxie-toggle--more">
                  <span class="naxie-toggle-icon">${ICONS.PLUS}</span>
                </button>
                <div class="naxie-dropdown naxie-dropdown--more">
                    <div class="naxie-dropdown-label">Options</div>
                    <div class="naxie-dropdown-separator"></div>
                    <div class="naxie-dropdown-item naxie-item--upload">
                        ${ICONS.UPLOAD} <span>Upload Document</span>
                    </div>
                </div>
              </div>
            </div>

            <div class="naxie-toolbar-group">
              <div class="naxie-popover-anchor" style="position:relative">
                <button class="naxie-toggle naxie-toggle--settings">
                  <span class="naxie-toggle-icon">${ICONS.SETTINGS}</span>
                </button>
                <div class="naxie-popover naxie-popover--settings">
                    <!-- Settings content injected here -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Upload Dialog Overlay -->
      <div class="naxie-dialog-overlay naxie-upload-overlay">
        <div class="naxie-dialog">
            <div class="naxie-dialog-header">
                <div class="naxie-dialog-title">Instant Upload</div>
                <div class="naxie-dialog-desc">Inject context directly into the AI's memory.</div>
            </div>
            <div class="naxie-upload-zone">
                <div class="naxie-upload-icon" style="opacity:0.5">${ICONS.UPLOAD}</div>
                <p style="margin:0; font-weight:500; color:#1e293b">Upload Documents</p>
                <p style="margin:5px 0 0; font-size:12px; color:#64748b">Support for PDF, TXT, and MD</p>
                <input type="file" multiple style="display:none" class="naxie-file-input">
            </div>
            <div class="naxie-dialog-footer">
                <button class="naxie-btn-cancel">Cancel</button>
                <button class="naxie-btn-confirm">Start Upload</button>
            </div>
        </div>
      </div>
    `;

    return window;
  }

  private setupEventListeners(): void {
    if (!this.chatWindow) return;

    // Header buttons
    this.chatWindow.querySelector('.naxie-btn-close')?.addEventListener('click', () => this.close());
    this.chatWindow.querySelector('.naxie-btn-maximize')?.addEventListener('click', () => this.toggleMaximize());
    
    // Feature Toggles (Web/Deep Search)
    const webToggle = this.chatWindow.querySelector('.naxie-toggle--web');
    webToggle?.addEventListener('click', () => {
      this.webSearch = !this.webSearch;
      webToggle.classList.toggle('naxie-toggle--active', this.webSearch);
    });

    const deepToggle = this.chatWindow.querySelector('.naxie-toggle--deep');
    deepToggle?.addEventListener('click', () => {
      this.deepSearch = !this.deepSearch;
      deepToggle.classList.toggle('naxie-toggle--active', this.deepSearch);
    });

    // Model Dropdown
    const modelToggle = this.chatWindow.querySelector('.naxie-toggle--model');
    const modelDropdown = this.chatWindow.querySelector('.naxie-dropdown--models') as HTMLElement;
    modelToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAllPopovers();
        this.renderModelList(modelDropdown);
        modelDropdown.classList.toggle('naxie-dropdown--open');
    });

    // More Options Dropdown
    const moreToggle = this.chatWindow.querySelector('.naxie-toggle--more');
    const moreDropdown = this.chatWindow.querySelector('.naxie-dropdown--more') as HTMLElement;
    moreToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAllPopovers();
        moreDropdown.classList.toggle('naxie-dropdown--open');
    });

    // Upload Item
    this.chatWindow.querySelector('.naxie-item--upload')?.addEventListener('click', () => {
        this.closeAllPopovers();
        this.showUploadDialog();
    });

    // Settings Popover
    const settingsToggle = this.chatWindow.querySelector('.naxie-toggle--settings');
    const settingsPopover = this.chatWindow.querySelector('.naxie-popover--settings') as HTMLElement;
    settingsToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAllPopovers();
        this.renderSettings(settingsPopover);
        settingsPopover.classList.toggle('naxie-popover--open');
    });

    // Prevent settings popover from closing when clicking inside it
    settingsPopover?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Global Close
    document.addEventListener('click', () => this.closeAllPopovers());
    
    // Input and Send
    const textarea = this.chatWindow.querySelector('.naxie-textarea') as HTMLTextAreaElement;
    const sendBtn = this.chatWindow.querySelector('.naxie-btn-send') as HTMLButtonElement;

    textarea?.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    });

    textarea?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    sendBtn?.addEventListener('click', () => this.handleSubmit());

    // Core events
    this.core.on(NaxieEvents.MESSAGE_RECEIVED, () => this.updateMessages());
    this.core.on(NaxieEvents.MESSAGE_SENT, () => {
      this.updateMessages();
      this.clearInput();
    });
    this.core.on(NaxieEvents.STATE_CHANGED, (state) => this.updateUI(state));
  }

  private closeAllPopovers() {
      this.chatWindow?.querySelectorAll('.naxie-dropdown--open, .naxie-popover--open').forEach(el => {
          el.classList.remove('naxie-dropdown--open', 'naxie-popover--open');
      });
  }

  private renderModelList(container: HTMLElement) {
      if (this.availableModels.length === 0) {
          container.innerHTML = `<div class="naxie-dropdown-item">Loading models...</div>`;
          return;
      }
      
      container.innerHTML = '';
      this.availableModels.forEach(model => {
          const item = document.createElement('div');
          item.className = 'naxie-dropdown-item';
          item.innerHTML = `
            <div style="display:flex; flex-direction:column">
                <span style="font-weight:500">${model.name}</span>
                <span style="font-size:10px; color:#6b7280">${(model.tags || []).join(' • ')}</span>
            </div>
          `;
          item.onclick = () => {
              this.core.setSelectedModel(model.name);
              this.closeAllPopovers();
          };
          container.appendChild(item);
      });
  }

  private renderSettings(container: HTMLElement) {
      const state = this.core.getState();
      const s = state.settings;

      container.innerHTML = `
        <div style="display:grid; gap: 12px;">
            <div>
                <div class="naxie-dropdown-label" style="padding:0; margin-bottom:5px;">Domain</div>
                <select class="naxie-select naxie-select--domain">
                    <option value="">Select Domain</option>
                    ${this.settingsOptions.domains.map((d: any) => `<option value="${d.id}" ${s.domain?.id === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
                </select>
            </div>
            <div>
                <div class="naxie-dropdown-label" style="padding:0; margin-bottom:5px;">Tags</div>
                <select class="naxie-select naxie-select--tags">
                    <option value="">Select Tag</option>
                    ${this.settingsOptions.tags.map((t: any) => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
                ${s.tags.length > 0 ? `
                    <div class="naxie-tags-chips">
                        ${s.tags.map((tag: any) => `
                            <div class="naxie-tag-chip" data-tag-id="${tag.id}">
                                <span>${tag.name}</span>
                                <button class="naxie-tag-remove" data-tag-id="${tag.id}">${ICONS.CLOSE}</button>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="naxie-slider-container">
                <label class="naxie-slider-label">Sensitivity (${s.sensitivity}%)</label>
                <input type="range" class="naxie-slider naxie-slider--sensitivity" min="0" max="100" value="${s.sensitivity}">
            </div>
            <div>
                <div class="naxie-dropdown-label" style="padding:0; margin-bottom:5px;">System Prompt</div>
                <select class="naxie-select naxie-select--prompt">
                    <option value="">Default Prompt</option>
                    ${this.settingsOptions.prompts.map((p: any) => `<option value="${p.id}" ${s.prompt === p.id ? 'selected' : ''}>${p.title || p.name}</option>`).join('')}
                </select>
            </div>
            <button class="naxie-btn-footer naxie-btn-outline naxie-btn--reset">
                ${ICONS.UNDO} Reset Settings
            </button>
        </div>
      `;

      // Wire up settling listeners
      const sensitivity = container.querySelector('.naxie-slider--sensitivity') as HTMLInputElement;
      sensitivity.oninput = () => {
          const val = parseInt(sensitivity.value);
          container.querySelector('.naxie-slider-label')!.textContent = `Sensitivity (${val}%)`;
          this.updateSettings({ sensitivity: val });
      };

      const domainSelect = container.querySelector('.naxie-select--domain') as HTMLSelectElement;
      domainSelect.onchange = () => {
          const id = domainSelect.value;
          const d = this.settingsOptions.domains.find((d: any) => d.id === id);
          this.updateSettings({ domain: d });
      };

      const tagsSelect = container.querySelector('.naxie-select--tags') as HTMLSelectElement;
      tagsSelect.onchange = () => {
          const tagId = tagsSelect.value;
          if (!tagId) return;

          const tag = this.settingsOptions.tags.find((t: any) => t.id === tagId);
          const currentTags = this.core.getState().settings.tags;
          
          if (tag && !currentTags.find((t: any) => t.id === tagId)) {
              this.updateSettings({ tags: [...currentTags, tag] });
              // Re-render to show updated chips
              this.renderSettings(container);
          }
          
          // Reset select to placeholder
          tagsSelect.value = "";
      };

      // Handle tag chip removal
      container.querySelectorAll('.naxie-tag-remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const tagId = (btn as HTMLElement).dataset.tagId;
              const currentState = this.core.getState().settings;
              const newTags = currentState.tags.filter((t: any) => t.id !== tagId);
              this.updateSettings({ tags: newTags });
              this.renderSettings(container);
          });
      });

      const promptSelect = container.querySelector('.naxie-select--prompt') as HTMLSelectElement;
      promptSelect.onchange = () => {
          this.updateSettings({ prompt: promptSelect.value });
      };

      container.querySelector('.naxie-btn--reset')?.addEventListener('click', () => {
          this.updateSettings({
              domain: undefined,
              tags: [],
              sensitivity: 70,
              prompt: ''
          });
          this.renderSettings(container);
      });
  }

  private updateSettings(partial: any) {
      this.core.updateSettings(partial);
  }

  private showUploadDialog() {
      const overlay = this.chatWindow?.querySelector('.naxie-upload-overlay') as HTMLElement;
      overlay.classList.add('naxie-dialog-overlay--open');

      const fileInput = overlay.querySelector('.naxie-file-input') as HTMLInputElement;
      const zone = overlay.querySelector('.naxie-upload-zone') as HTMLElement;
      const confirmBtn = overlay.querySelector('.naxie-btn-confirm') as HTMLButtonElement;
      const cancelBtn = overlay.querySelector('.naxie-btn-cancel') as HTMLButtonElement;

      zone.onclick = () => fileInput.click();
      
      let selectedFiles: File[] = [];
      fileInput.onchange = () => {
          selectedFiles = Array.from(fileInput.files || []);
          zone.querySelector('p')!.textContent = selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Click or drag files here to upload';
      };

      confirmBtn.onclick = async () => {
          if (selectedFiles.length === 0) return;
          confirmBtn.disabled = true;
          confirmBtn.textContent = 'Uploading...';
          try {
              await this.core.uploadFiles(selectedFiles);
              overlay.classList.remove('naxie-dialog-overlay--open');
          } catch (e) {
              alert('Upload failed: ' + e);
          } finally {
              confirmBtn.disabled = false;
              confirmBtn.textContent = 'Upload';
          }
      };

      cancelBtn.onclick = () => overlay.classList.remove('naxie-dialog-overlay--open');
  }

  private handleSubmit(): void {
    const textarea = this.chatWindow?.querySelector('.naxie-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const text = textarea.value.trim();
    const state = this.core.getState();
    const s = state.settings;

    if (text) {
      // Calculate sensitivity score same as React (0.1 - 1.0)
      const sensitivityScore = parseFloat(
        (0.1 + (s.sensitivity - 1) * (0.89 / 99)).toFixed(2)
      ).toString();

      this.core.sendMessage(text, {
        model: state.selectedModel,
        web_search: this.webSearch,
        deep_search: this.deepSearch,
        domain: s.domain?.id,
        tags: s.tags.map(t => t.id),
        score: sensitivityScore,
        prompt: s.prompt,
      });
    }
  }

  private clearInput(): void {
    const textarea = this.chatWindow?.querySelector('.naxie-textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = '';
      textarea.style.height = 'auto';
    }
  }

  private updateMessages(): void {
    const messagesContainer = this.chatWindow?.querySelector('.naxie-messages') as HTMLElement;
    if (!messagesContainer) return;

    const state = this.core.getState();
    const history = state.chatHistory;

    if (history.length === 0) {
      messagesContainer.innerHTML = `
        <div class="naxie-empty-state naxie-fade-in">
          <div class="naxie-empty-icon">${ICONS.NAXIE}</div>
          <div class="naxie-empty-title">Welcome to Naxie</div>
          <div class="naxie-empty-desc">Ask a question to start exploring your data directly from the dashboard.</div>
        </div>
      `;
      return;
    }

    // Check if we should scroll to bottom (if user is already near bottom)
    const isAtBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight + 100;

    // Clear empty state if needed
    if (messagesContainer.querySelector('.naxie-empty-state')) {
      messagesContainer.innerHTML = '';
    }

    const currentMsgElements = messagesContainer.querySelectorAll('.naxie-message-wrapper:not(.naxie-message--loader)');
    
    // If it's a full reset (history shorter than current or first message different), clear and rebuild
    if (history.length < currentMsgElements.length) {
      messagesContainer.innerHTML = '';
    }

    history.forEach((msg, index) => {
      let msgEl = messagesContainer.querySelector(`[data-message-index="${index}"]`) as HTMLElement;
      
      if (!msgEl) {
        // Create new message element
        msgEl = document.createElement('div');
        msgEl.className = `naxie-message-wrapper naxie-message--${msg.role}-wrapper naxie-fade-in`;
        msgEl.setAttribute('data-message-index', index.toString());
        
        if (msg.role === 'user') {
          msgEl.innerHTML = `
            <div class="naxie-avatar naxie-avatar--user">${ICONS.USER}</div>
            <div class="naxie-message-container">
              <div class="naxie-message-content" style="font-weight: 500;">${msg.content}</div>
            </div>
          `;
        } else {
          msgEl.innerHTML = `
            <div class="naxie-avatar naxie-avatar--assistant">${ICONS.NAXIE}</div>
            <div class="naxie-message-container">
              <div class="naxie-message-content" id="msg-content-${index}"></div>
              <div class="naxie-message-footer" id="msg-footer-${index}" style="display:none"></div>
            </div>
          `;
        }
        
        // Remove loader before appending new message if it exists
        const loader = messagesContainer.querySelector('.naxie-message--loader');
        if (loader) messagesContainer.removeChild(loader);
        
        messagesContainer.appendChild(msgEl);
      }

      // Update content for assistant messages (streaming)
      if (msg.role === 'assistant') {
        const contentEl = msgEl.querySelector(`#msg-content-${index}`);
        if (contentEl) {
          const newHtml = marked.parse(msg.content || '') as string;
          if (contentEl.innerHTML !== newHtml) {
            contentEl.innerHTML = newHtml;
          }
        }

        // Show/Update footer if message is complete
        const isLast = index === history.length - 1;
        const isComplete = !state.isLoading || !isLast;
        const footerEl = msgEl.querySelector(`#msg-footer-${index}`) as HTMLElement;
        
        if (isComplete && footerEl && footerEl.style.display === 'none') {
          footerEl.style.display = 'flex';
          footerEl.innerHTML = `
            <div class="naxie-message-actions">
              <button class="naxie-action-btn naxie-btn-copy">${ICONS.COPY}</button>
              <button class="naxie-action-btn naxie-btn-regen">${ICONS.REGEN}</button>
            </div>
            <div class="naxie-refs-container"></div>
          `;

          footerEl.querySelector('.naxie-btn-copy')?.addEventListener('click', () => {
             navigator.clipboard.writeText(msg.content);
             const btn = footerEl.querySelector('.naxie-btn-copy') as HTMLElement;
             btn.style.color = '#3b82f6';
             setTimeout(() => btn.style.color = '', 1000);
          });

          footerEl.querySelector('.naxie-btn-regen')?.addEventListener('click', () => this.core.regenerate());

          const refsContainer = footerEl.querySelector('.naxie-refs-container');
          if (refsContainer && msg.refs?.refs?.length > 0) {
            msg.refs.refs.slice(0, 3).forEach((ref: any, idx: number) => {
              const chip = document.createElement('button');
              chip.className = 'naxie-ref-chip';
              chip.innerHTML = `${ICONS.FILE_MINUS} Ref ${idx + 1}`;
              chip.onclick = () => console.log('Jump to ref', ref);
              refsContainer.appendChild(chip);
            });
          }
        }
      }
    });

    // Add loader if loading and not already present
    if (state.isLoading && !messagesContainer.querySelector('.naxie-message--loader')) {
      const loader = document.createElement('div');
      loader.className = 'naxie-message-wrapper naxie-message--assistant-wrapper naxie-message--loader';
      loader.innerHTML = `
        <div class="naxie-avatar naxie-avatar--assistant">${ICONS.NAXIE}</div>
        <div class="naxie-message-container">
           <div class="naxie-typing">
            <div class="naxie-dot"></div>
            <div class="naxie-dot"></div>
            <div class="naxie-dot"></div>
          </div>
        </div>
      `;
      messagesContainer.appendChild(loader);
    }

    // Scroll to bottom if we were already there
    if (isAtBottom) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  private updateUI(state: any): void {
    if (!this.chatWindow) return;

    // Update icons
    const maxBtn = this.chatWindow.querySelector('.naxie-btn-maximize');
    if (maxBtn) maxBtn.innerHTML = state.isMaximized ? ICONS.MINIMIZE : ICONS.MAXIMIZE;

    if (state.isMaximized) {
      this.chatWindow.classList.add('naxie-chat-window--maximized');
    } else {
      this.chatWindow.classList.remove('naxie-chat-window--maximized');
    }

    const textarea = this.chatWindow.querySelector('.naxie-textarea') as HTMLTextAreaElement;
    const sendBtn = this.chatWindow.querySelector('.naxie-btn-send') as HTMLButtonElement;
    
    if (textarea) textarea.disabled = state.isLoading;
    if (sendBtn) sendBtn.disabled = state.isLoading;

    // Update selected model name in UI
    const modelNameDisplay = this.chatWindow.querySelector('.naxie-model-name');
    if (modelNameDisplay) modelNameDisplay.textContent = state.selectedModel;

    this.updateMessages();
  }

  open(): void {
    if (!this.chatWindow) return;
    this.chatWindow.classList.add('naxie-chat-window--open');
    if (this.chatBubble) this.chatBubble.style.display = 'none';
    this.core.toggleOpen();
    (this.chatWindow.querySelector('.naxie-textarea') as HTMLTextAreaElement)?.focus();
  }

  close(): void {
    if (!this.chatWindow) return;
    this.chatWindow.classList.remove('naxie-chat-window--open');
    if (this.chatBubble) this.chatBubble.style.display = 'flex';
    this.closeAllPopovers();
    this.core.toggleOpen();
  }

  toggleMaximize(): void {
    this.core.toggleMaximized();
  }

  sendMessage(text: string): void {
    this.core.sendMessage(text);
  }

  on(event: string, callback: (...args: any[]) => void): () => void {
    return this.core.on(event, callback);
  }

  destroy(): void {
    this.core.destroy();
    this.container.innerHTML = '';
  }
}
