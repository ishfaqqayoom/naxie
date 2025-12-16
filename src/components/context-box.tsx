import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, ChevronRight, Copy, Trash } from 'lucide-react';
import React, { useState } from 'react';
import MarkdownComponent from './markdown';

export interface ContextItem {
  filename: string;
  text: string;
}

interface ContextBoxProps {
  isPopoverOpen: boolean;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contexts: ContextItem[];
  setContexts: (contexts: ContextItem[]) => void;
}

export function ContextBox({
  isPopoverOpen,
  setIsPopoverOpen,
  contexts,
  setContexts,
}: ContextBoxProps) {
  const [copied, setCopied] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentContext = contexts?.[currentIndex];

  const handleCopy = () => {
    if (!currentContext) return;
    navigator.clipboard.writeText(currentContext.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setContexts([]);
    setIsPopoverOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < contexts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      <Dialog open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={false}>
        <DialogContent
          className='z-50 p-0 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-w-[600px] w-[50vw] bg-white rounded-md shadow-lg border border-gray-200'
          onInteractOutside={(e) => e.preventDefault()}>
          <div className='flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100 rounded-t-md'>
            <p className='font-medium text-sm truncate max-w-[300px] text-gray-700'>
              {currentContext?.filename || 'No Context'}
            </p>

            <div className="flex items-center gap-2">
                 <Trash
                    className='cursor-pointer text-gray-400 hover:text-red-500 transition-colors'
                    size={18}
                    onClick={handleClear}
                 />
                 {currentContext?.text && (
                    <Button
                        onClick={handleCopy}
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-gray-500 hover:text-gray-700'
                    >
                        {copied ? (
                            <Check size={16} className='text-green-500' />
                        ) : (
                            <Copy size={16} />
                        )}
                    </Button>
                )}
            </div>
          </div>

          {currentContext?.text ? (
            <div className='px-4 py-4 text-xs max-h-[60vh] overflow-y-auto bg-white'>
              <MarkdownComponent content={currentContext.text} />
            </div>
          ) : (
             <div className="p-8 text-center text-gray-400 text-sm">
                 No context available
             </div>
          )}

          <div className='flex justify-between items-center p-2 bg-gray-50 border-t border-gray-100 rounded-b-md'>
             <div /> {/* Spacer */}
            <div className="flex items-center gap-2">
                <Button variant='ghost' size='icon' onClick={handlePrev} disabled={currentIndex === 0} className="h-8 w-8">
                <ChevronLeft
                    size={18}
                    className={currentIndex === 0 ? 'text-gray-300' : 'text-gray-600'}
                />
                </Button>

                <span className='text-xs text-gray-500'>
                {contexts.length > 0 ? `${currentIndex + 1} / ${contexts.length}` : '0 / 0'}
                </span>

                <Button variant='ghost' size='icon' onClick={handleNext} disabled={contexts.length === 0 || currentIndex === contexts.length - 1} className="h-8 w-8">
                <ChevronRight
                    size={18}
                    className={contexts.length === 0 || currentIndex === contexts.length - 1 ? 'text-gray-300' : 'text-gray-600'}
                />
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
