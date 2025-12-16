import { Globe } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Toggle } from '@/components/ui/toggle';
import { TypographyP } from '@/components/ui/typography';

interface WebSearchToggleProps {
  webSearch: boolean;
  setWebSearch: (val: boolean) => void;
  setDeepSearch: (val: boolean) => void;
}

export function WebSearchToggle({
  setWebSearch,
  setDeepSearch,
  webSearch,
}: WebSearchToggleProps) {
  return (
    <Toggle
      pressed={webSearch}
      onPressedChange={(value) => {
        setWebSearch(value);
        if (value) setDeepSearch(false);
      }}
      size='sm'
      aria-label='Toggle Web Search'
      className='ml-1 bg-gray-100 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-200'>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <Globe className='h-4 w-4' />
          </TooltipTrigger>
          <TooltipContent sideOffset={15}>
            <TypographyP className='text-xs font-light'>
              Web Search is {webSearch ? 'ON' : 'OFF'}
            </TypographyP>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Toggle>
  );
}
