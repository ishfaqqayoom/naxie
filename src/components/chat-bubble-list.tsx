import { TypographyP } from '@/components/ui/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Copy, FileMinus, RefreshCcw } from 'lucide-react'; // Added RefreshCcw
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect, useRef, useState, Fragment } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import MarkdownComponent from './markdown';
import { Button } from '@/components/ui/button';
import { ChatBubbleListProps } from '@/types';

export function ChatBubbleList({ chatHistory, onRegenerate }: ChatBubbleListProps) {
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const [copyStatus, setCopyStatus] = useState<{ [key: number]: string }>({});
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: number]: boolean }>({});
  const [showRefs, setShowRefs] = useState<{ [key: number]: boolean }>({});

  const handleCopyClick = (message: string, index: number) => {
    navigator.clipboard
      .writeText(message)
      .then(() => {
        setCopyStatus((prev) => ({ ...prev, [index]: 'Copied' }));
        setTimeout(() => {
          setCopyStatus((prev) => ({ ...prev, [index]: 'Copy' }));
        }, 1000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const gotoParagraph = (ref: any) => {
    console.log('Jump to reference:', ref);
  };

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div
      className='bg-muted overflow-y-auto scroll-smooth h-full'
      ref={chatListRef}>
      {chatHistory.map((message: any, index: number) => (
        <Fragment key={index}>
          {message.sendMessage && message.sendMessage !== '' && (
            <div className='w-[90%] flex mx-auto mt-4'>
              <Avatar className='bg-blackA1 inline-flex h-[30px] w-[30px] select-none items-center justify-center overflow-hidden rounded-full align-middle'>
                <AvatarFallback className='text-violet11 leading-1 flex h-full w-full items-center justify-center bg-secondary text-[15px] font-medium'>
                  <User color='#4318FF' size={18} />
                </AvatarFallback>
              </Avatar>
              <div className='ml-4 bg-light w-full p-3 text-black rounded-md text-sm font-medium'>
                <TypographyP>{message.sendMessage}</TypographyP>
              </div>
            </div>
          )}

          {message.receivedMessage === '' && (
            <div className='w-[90%] mx-auto mt-4 '>
              <Avatar className='inline-flex h-[30px] w-[30px] select-none items-center justify-center overflow-hidden rounded-full align-middle'>
                <ThreeDots
                  height='30'
                  width='30'
                  color='#4e43c7'
                  radius='4'
                  ariaLabel='three-dots-loading'
                />
              </Avatar>
            </div>
          )}

          {message.receivedMessage !== '' && (
            <div className='w-[90%] flex items-baseline mx-auto mt-4 mb-4'>
              <Avatar className='bg-primary inline-flex h-[30px] w-[30px] select-none items-center justify-center overflow-hidden rounded-full align-middle'>
                <AvatarImage
                  className='h-full w-full rounded-[inherit] object-scale-down object-center bg-primary'
                  src='/images/naxie/Ask1.png'
                  alt='AI'
                  style={{ marginRight: '1px', marginBottom: '1px' }}
                />
                <AvatarFallback className='bg-primary text-white'>
                  AI
                </AvatarFallback>
              </Avatar>

              <div className='ml-4 bg-light w-full p-3 text-black rounded-md font-small'>
                <TypographyP className='bg-light  max-w-full text-black font-light text-sm rounded-md leading-8 overflow-y-auto'>
                  <MarkdownComponent content={message.receivedMessage} />
                </TypographyP>

                {/* Reference Section */}
                <div className='flex justify-between mt-2 pt-2 border-t border-gray-100'>
                  <div>
                    <div className='flex flex-wrap items-center'>
                      {/* Copy Button */}
                      <TooltipProvider>
                        <Tooltip
                          open={tooltipOpen[index]}
                          onOpenChange={(open) =>
                            setTooltipOpen({ ...tooltipOpen, [index]: open })
                          }>
                          <TooltipTrigger asChild>
                            <Copy
                              className='cursor-pointer text-gray-400 hover:text-blue-500 mr-2'
                              strokeWidth={1}
                              size={16}
                              onClick={() => {
                                handleCopyClick(
                                  message.receivedMessage,
                                  index
                                );
                                setTooltipOpen({
                                  ...tooltipOpen,
                                  [index]: true
                                });
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <TypographyP className='text-xs'>
                              {copyStatus[index] || 'copy'}
                            </TypographyP>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Regenerate Button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <RefreshCcw
                              className='cursor-pointer text-gray-400 hover:text-blue-500 mr-2'
                              strokeWidth={1}
                              size={16}
                              onClick={() => onRegenerate?.(message, index)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <TypographyP className='text-xs'>
                              Regenerate
                            </TypographyP>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {message.refs && message.refs.refs && (
                        <>
                          {!showRefs[index]
                            ? message.refs.refs
                              .slice(0, 3)
                              .map((reference: any, idx: any) => (
                                <Button
                                  onClick={() => gotoParagraph(reference)}
                                  key={idx}
                                  variant='ghost'
                                  size='sm'
                                  className='p-1 font-light text-primary border-none rounded-lg text-xs hover:text-accent-foreground hover:bg-primary-light m-1 h-auto'>
                                  <FileMinus
                                    strokeWidth={1}
                                    size={14}
                                    className='mr-1 text-primary'
                                  />
                                  Ref {idx + 1}
                                </Button>
                              ))
                            : message.refs.refs.map(
                              (reference: any, idx: any) => (
                                <Button
                                  onClick={() => gotoParagraph(reference)}
                                  key={idx}
                                  variant='ghost'
                                  size='sm'
                                  className='p-1 font-light text-primary border-none rounded-lg text-xs hover:text-accent-foreground hover:bg-primary-light m-1 h-auto'>
                                  <FileMinus
                                    strokeWidth={1}
                                    size={14}
                                    className='mr-1 text-primary'
                                  />
                                  Ref {idx + 1}
                                </Button>
                              )
                            )}

                          {!showRefs[index] && message.refs.refs.length > 3 ? (
                            <TypographyP
                              className='cursor-pointer text-xs text-primary border rounded-md p-1 px-2 hover:font-bold'
                              onClick={() =>
                                setShowRefs((prev) => ({
                                  ...prev,
                                  [index]: true
                                }))
                              }>
                              more...
                            </TypographyP>
                          ) : (
                            message.refs.refs.length > 3 && (
                              <span
                                role='button'
                                tabIndex={0}
                                onClick={() =>
                                  setShowRefs((prev) => ({
                                    ...prev,
                                    [index]: false
                                  }))
                                }>
                                <TypographyP
                                  className='cursor-pointer text-xs text-primary border rounded-md p-1 px-2 hover:font-bold'>
                                  less
                                </TypographyP>
                              </span>
                            )
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
