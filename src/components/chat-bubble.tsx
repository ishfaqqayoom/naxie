'use client';

import { useState, useMemo } from 'react';
import { MessageSquare, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypographyH3 } from '@/components/ui/typography';
import { CardDescription, CardHeader } from '@/components/ui/card';
import { AnimatedCard } from './animated-card';
import { ChatBubbleList } from './chat-bubble-list';
import { InputChat } from './input-chat';
import { ChatComponentProps } from '@/types';

import { Toaster } from '@/components/ui/toaster';

const DEFAULT_WEBSOCKET_CONFIG = {
  endpoint: 'answer/ws',
  baseUrl: 'wss://dev-api.cognax.ai/api',
};

export function ChatComponent({
  title = 'Chat with Dashboard',
  placeholder = 'Ask a question',
  className = '',
  defaultOpen = false,
  showBubble = true,
  customData = {},
  apiConfig,
  websocketConfig = DEFAULT_WEBSOCKET_CONFIG,
}: ChatComponentProps) {
  const finalApiConfig = useMemo(() => ({
    baseUrl: 'https://dev-api.cognax.ai/api',
    ...apiConfig,
  } as any), [apiConfig]);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMaximize, setIsMaximize] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const texts = [
    'Chat with your data directly from the dashboard – insights at your fingertips.',
    'Seamlessly explore dashboards and tables through an AI-powered chat interface.',
    'Ask questions, get answers — instantly explore data using natural language.',
    'Transform your tables into conversations with intuitive chat.',
    'Interact with your metrics in real time – no queries, just questions.',
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleWidth = () => {
    setIsMaximize(!isMaximize);
  };

  return (
    <div className={`fixed bottom-4 right-4 font-sans z-50 ${className}`}>
      {!isOpen && showBubble && (
        <Button
          onClick={toggleChat}
          className='flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg rounded-full hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50'>
          <MessageSquare size={24} />
        </Button>
      )}

      {/* Chat Bubble Box */}
      <div
        className={`absolute z-50 bottom-0 right-0 bg-light rounded-xl shadow-xl ${isMaximize ? 'w-[40vw]' : 'w-96'
          } transform transition-all duration-300 ease-in-out ${isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
          }`}>
        {/* Chat Header */}
        <div className='bg-primary text-white p-3 rounded-t-xl flex justify-between items-center'>
          <TypographyH3 className='font-medium text-sm'>{title}</TypographyH3>
          <div>
            <button
              onClick={toggleWidth}
              className='p-1 rounded-full hover:bg-white/20 transition-colors duration-200'>
              {isMaximize ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={toggleChat}
              className='p-1 rounded-full hover:bg-white/20 transition-colors duration-200'>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className='rounded-md backdrop-blur-md -mt-1'>
          <div className='flex flex-col justify-between min-h-[90vh] max-h-[90vh] overflow-y-auto bg-muted'>
            {chatHistory.length > 0 ? (
              <ChatBubbleList chatHistory={chatHistory} />
            ) : (
              <CardHeader>
                <CardDescription className='pt-3'>
                  How can I help you today? Ask a question from your data.
                </CardDescription>
                <AnimatedCard className='info-card' text={texts} />
              </CardHeader>
            )}
            <div className='px-2 mb-2'>
              <InputChat
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                websocketConfig={websocketConfig}
                customData={customData}
                placeholder={placeholder}
                apiConfig={finalApiConfig}
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default ChatComponent;
