import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Plus, FileUp } from 'lucide-react';

interface NaxieDropdownMenuProps {
  setIsPopoverOpen?: (val: boolean) => void;
  isPopoverOpen?: boolean;
}

export function NaxieDropdownMenu({
  setIsPopoverOpen,
  isPopoverOpen,
}: NaxieDropdownMenuProps) {
  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='m-2 bg-gray-100 w-10 h-10 rounded-lg border-none p-0 text-foreground hover:bg-secondary hover:text-dark flex items-center justify-center'>
                <Plus className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={6}
            className='bg-white shadow-md border border-1 rounded-md px-3 py-1.5'>
            <p className='text-xs font-light'>More Options</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align='start'>
        <DropdownMenuLabel className='text-xs'>Naxie Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setIsPopoverOpen?.(!isPopoverOpen)}>
            <div className='flex items-center space-x-4 w-full cursor-pointer'>
              <FileUp className='h-4 w-4' />
              <p className='text-xs'>Instant Upload</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
