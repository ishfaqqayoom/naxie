import { Button } from '@/components/ui/button';
import { Search, CircleDashed, SendHorizontal } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import {
  connectToWebSocket,
  sendMessage,
  addMessageHandler,
  removeMessageHandler,
  addCloseHandler,
  removeCloseHandler,
  disconnectWebSocket,
  isWebSocketOpen,
} from '@/services/socket';
import { WebSocketConfig, ApiConfig } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { ModelSelect } from './model-select';
import { WebSearchToggle } from './web-search-toggle';
import { DeepSearchToggle } from './deep-search-toggle';
import { NaxieDropdownMenu } from './naxie-options';
import { SettingPopOver, SettingsState } from './settings/settings-popover';
import { InstantFileUploadDialog } from './instant-file-upload';
import { ContextBox } from './context-box';
// Types imported but not used as values can be removed if not needed, or used as type imports
// import { Tag } from './settings/select-tag';
// import { Domain } from './settings/select-domain';

interface InputChatProps {
  chatHistory: any;
  setChatHistory: (history: any) => void;
  websocketConfig?: WebSocketConfig;
  customData?: Record<string, any>;
  placeholder?: string;
  apiConfig?: ApiConfig;
}

export function InputChat({
  setChatHistory,
  websocketConfig,
  customData = {},
  placeholder = 'Ask a question',
  apiConfig,
}: InputChatProps) {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  // Feature States
  const [modelName, setModelName] = useState<string>('gpt-4'); // Default
  const [webSearch, setWebSearch] = useState<boolean>(false);
  const [deepSearch, setDeepSearch] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // For upload dialog

  // Context State
  const [context, setContext] = useState<any[]>([]); // Array of context items
  const [isContextBoxOpen, setIsContextBoxOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<SettingsState>({
    tags: [],
    sensitivity: 70, // Default to ~0.7 points
    prompt: '',
    domain: undefined,
  });

  const handleSettingsChange = (newSettings: SettingsState) => {
    setSettings(newSettings);
  };

  // Open context box when context is updated (if not empty)
  useEffect(() => {
    if (context && context.length > 0) {
      // Optional: auto-open or just let user open it. 
      // Cognax logic: if (context?.text) setIsContextBoxOpen(true);
      // Here we'll just set it to open if it was previously 
      setIsContextBoxOpen(true);
    }
  }, [context]);


  const handleResetSettings = () => {
    setSettings({
      tags: [],
      sensitivity: 70,
      prompt: '',
      domain: undefined,
    });
  };

  const handleInputResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(
        Math.max(textareaRef.current.scrollHeight, 56),
        200
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    handleInputResize();
  }, [query]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleQuerySend = () => {
    if (query.trim() === '') return;

    if (isWebSocketOpen()) {
      setLoading(true);

      // Add user message to chat history
      setChatHistory((prevChatHistory: any) => [
        ...prevChatHistory,
        { sendMessage: query, receivedMessage: '' },
      ]);

      // Helper to calculate sensitivity points from slider value
      const sensitivityScore = parseFloat(
        (0.1 + (settings.sensitivity - 1) * (0.89 / 99)).toFixed(2)
      ).toString();

      // Send message via WebSocket with ALL features
      // Add apiConfig.apiKey if present for backend authentication/tracking if needed by socket
      // But typically socket auth is done on connection. 
      // The requirement was: "User ID/ API token needs to be passed"
      // If the socket message needs it, we add it. 
      const payload: any = {
        user_query: query,
        session_id: sessionId,
        model: modelName,
        web_search: webSearch,
        deep_research: deepSearch,

        // Settings mappings
        domain: settings.domain?.id,
        tags: settings.tags.map(t => t.id),
        score: sensitivityScore,
        prompt: settings.prompt,

        ...customData,
      };

      // if (apiConfig?.apiKey) {
      //   payload.api_key = apiConfig.apiKey;
      // }

      sendMessage(payload);

      setQuery('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '56px';
        textareaRef.current.value = ''; // Force clear DOM element too just in case
      }

    } else {
      if (websocketConfig) {
        connectToWebSocket(websocketConfig);
      }
    }
  };

  const handleSubmit = () => {
    if (query.trim() === '' || loading) return;
    handleQuerySend();
  };

  useEffect(() => {
    if (!websocketConfig) return;

    connectToWebSocket(websocketConfig);

    let answerRef = false;
    let isSessionId = false;

    const messageHandler = (data: any) => {
      // Handle session ID on first message
      if (!isSessionId) {
        try {
          // If data is JSON, checking for session_id
          // Sometimes the first message IS the session ID JSON
          const sessionData = JSON.parse(data);
          if (sessionData.session_id) {
            setSessionId(sessionData.session_id);
            isSessionId = true;
            return;
          }
        } catch (e) {
          // If not JSON, it might be part of the answer or a raw string
          // But usually session_id comes first as a JSON object
        }
      }

      // Handle EOF marker
      if (data === 'EOF') {
        answerRef = true;
        return;
      }

      // Handle refs/context after EOF
      if (answerRef) {
        answerRef = false;
        setLoading(false);

        setChatHistory((prevChatHistory: any) => {
          const updatedChatHistory = [...prevChatHistory];
          const lastMessageIndex = updatedChatHistory.length - 1;

          try {
            const parsedData = JSON.parse(data);

            // Check if it's context data (Cognax sends context as part of refs or separate?)
            // Looking at Cognax code:
            // if (answerRef) { ... const refs = JSON.parse(data); ... }
            // So 'data' here is the refs object.

            // Depending on the backend structure, context might be inside refs or distinct.
            // If the backend sends context in this payload, we should extract it.
            // Assuming 'context' field exists in the parsed data if it's sent here.

            if (parsedData.context) {
              // If context is returned here, update it.
              // Cognax code used Redux: const contexts = useSelector(...)
              // And it seems it gets updated via some side channel or maybe this payload?
              // The viewed code for naxie-search.tsx only showed refs update: updatedChatHistory[lastMessageIndex].refs = refs;

              // If logic parallels Cognax, maybe "refs" contains context?
              // Or maybe we need to handle a specific message type for context.

              // For now, let's assume if there are 'refs', we update the chat history.
              // If there is 'context' in the payload, we update local context state.
              if (Array.isArray(parsedData.context)) {
                setContext(parsedData.context);
              } else if (parsedData.context) {
                setContext([parsedData.context]);
              }
            }

            if (
              lastMessageIndex >= 0 &&
              updatedChatHistory[lastMessageIndex].receivedMessage !== undefined
            ) {
              updatedChatHistory[lastMessageIndex].refs = parsedData;
            } else {
              updatedChatHistory.push({ refs: parsedData });
            }
          } catch (e) {
            console.error('Failed to parse refs/context:', e);
          }

          return updatedChatHistory;
        });
      } else {
        // Append streaming text chunks
        setChatHistory((prevChatHistory: any) => {
          const updatedChatHistory = [...prevChatHistory];
          const lastMessageIndex = updatedChatHistory.length - 1;

          if (lastMessageIndex >= 0) {
            const currentMessage = updatedChatHistory[lastMessageIndex].receivedMessage || '';
            updatedChatHistory[lastMessageIndex] = {
              ...updatedChatHistory[lastMessageIndex],
              receivedMessage: currentMessage + data
            };
          } else {
            updatedChatHistory.push({
              sendMessage: '',
              receivedMessage: data
            });
          }
          return updatedChatHistory;
        });
      }
    };

    const handleSocketClose = () => {
      console.log('WebSocket connection was closed. Resetting state.');
      isSessionId = false;
      answerRef = false;
      setSessionId('');
      setLoading(false);
    };

    addMessageHandler(messageHandler);
    addCloseHandler(handleSocketClose);

    return () => {
      removeMessageHandler(messageHandler);
      removeCloseHandler(handleSocketClose);
      disconnectWebSocket();
    };
  }, [setChatHistory, websocketConfig, apiConfig]); // Added apiConfig to deps if needed, though mostly for handleQuerySend which is function


  const handleUpload = async (files: File[], _metadata: any) => {
    if (!apiConfig?.apiKey || !apiConfig?.baseUrl) {
      console.warn('Missing API Config for upload');
      throw new Error('apiKey expires');
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('documents', file);
    });

    try {
      const response = await fetch(`${apiConfig.baseUrl}/document/instant_upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          // Content-Type is set automatically for FormData
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('apiKey expires');
        }
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      await response.json(); // Consume response
    } catch (error) {
      console.error('Upload error:', error);
      throw error; // Re-throw to be caught by dialog for error state
    }
  };


  return (
    <div className='w-full mx-auto'>
      <div
        className={`bg-white rounded-xl shadow-md transition-shadow transition-all duration-200 ${focused ? '' : ''
          }`}>
        <div className='relative'>
          {/* Search icon */}
          <div className='absolute left-3 top-4 text-gray-400'>
            <Search size={20} />
          </div>

          {/* Textarea input */}
          <Textarea
            spellCheck={true}
            ref={textareaRef}
            placeholder={placeholder}
            className='w-full pl-10 pr-12 pt-4 resize-none border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent  shadow-none min-h-[56px] max-h-[180px]'
            onKeyDown={handleKeyDown}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            // style={{ minHeight: '56px', maxHeight: '180px' }} // moved to className
            disabled={loading}
          />

          {/* Send Button Absolute Positioned */}
          <div className='absolute right-2 bottom-3'>
            <Button
              className={`p-2 h-8 w-8 rounded-md ${!query.trim() || loading ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white hover:bg-primary/90'
                } transition-colors border-none`}
              onClick={handleSubmit}
              disabled={!query.trim() || loading}>
              {loading ? (
                <CircleDashed size={18} className='animate-spin' />
              ) : (
                <SendHorizontal size={18} />
              )}
            </Button>
          </div>
        </div>

        {/* Bottom toolbar with controls */}
        <div className='flex justify-between items-center px-3 pb-2 pt-1 border-t border-gray-100'>
          <div className='flex items-center space-x-1'>
            <ModelSelect
              initialModel={modelName}
              onModelSelect={(modelDetails) => {
                setModelName(modelDetails.id);
              }}
              apiConfig={apiConfig}
            />
            <WebSearchToggle
              setWebSearch={setWebSearch}
              setDeepSearch={setDeepSearch}
              webSearch={webSearch}
            />
            <DeepSearchToggle
              setDeepSearch={setDeepSearch}
              setWebSearch={setWebSearch}
              deepSearch={deepSearch}
            />
            <NaxieDropdownMenu
              setIsPopoverOpen={setIsPopoverOpen}
              isPopoverOpen={isPopoverOpen}
            />
          </div>

          <div className='flex items-center space-x-2'>
            {/* Character counter */}
            {query.length > 0 && (
              <span className='text-xs text-gray-400'>
                {query.length} chars
              </span>
            )}

            <SettingPopOver
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onReset={handleResetSettings}
              apiConfig={apiConfig}
            />
            {/* Send Button Removed from here */}
          </div>
        </div>
      </div>

      <InstantFileUploadDialog
        isPopoverOpen={isPopoverOpen}
        setIsPopoverOpen={setIsPopoverOpen}
        onUpload={handleUpload}
      />

      <ContextBox
        isPopoverOpen={isContextBoxOpen}
        setIsPopoverOpen={setIsContextBoxOpen}
        contexts={context}
        setContexts={setContext}
      />
    </div>
  );
}
