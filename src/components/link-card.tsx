import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import MarkdownComponent from './markdown';

interface HoverCardTextProps {
  children: any;
  refs: any;
}

export default function HoverCardText({ children, refs }: HoverCardTextProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='p-2 border-none rounded-sm hover:text-blue-600 hover:bg-blue-50 mx-1 font-medium text-blue-500 transition-all duration-200'>
          {children}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-80 md:w-96 p-0 shadow-lg border border-gray-200 rounded-xl overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100 text-ellipsis truncate'>
          {children && <>{refs[children]?.file_name}</>}
        </div>

        {/* Content */}
        <div className='p-4'>
          <div className='max-h-40 overflow-y-auto text-gray-700 text-xs'>
            <MarkdownComponent content={refs[children]?.text} />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
