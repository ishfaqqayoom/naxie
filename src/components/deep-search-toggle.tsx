import { Telescope } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Toggle } from '@/components/ui/toggle';
import { TypographyP } from '@/components/ui/typography';

interface DeepSearchToggleProps {
  deepSearch: boolean;
  setDeepSearch: (val: boolean) => void;
  setWebSearch: (val: boolean) => void;
}

export function DeepSearchToggle({
  setDeepSearch,
  setWebSearch,
  deepSearch,
}: DeepSearchToggleProps) {
  return (
    <Toggle
      pressed={deepSearch}
      onPressedChange={(value) => {
        setDeepSearch(value);
        if (value) setWebSearch(false);
      }}
      size='sm'
      aria-label='Toggle Deep Search'
      className='ml-1 bg-gray-100 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-200'>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <Telescope className='h-4 w-4' />
          </TooltipTrigger>
          <TooltipContent sideOffset={15}>
            <TypographyP className='text-xs font-light'>
              Deep Search is {deepSearch ? 'ON' : 'OFF'}
            </TypographyP>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Toggle>
  );
}
