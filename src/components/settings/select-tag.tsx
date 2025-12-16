import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { ChevronDown, X, Loader2 } from 'lucide-react';
import { ApiConfig } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface Tag {
  id: string;
  name: string;
}

interface SelectTagProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  availableTags?: Tag[];
  apiConfig?: ApiConfig;
}

export function SelectTag({
  selectedTags,
  onTagsChange,
  availableTags = [],
  apiConfig,
}: SelectTagProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>(availableTags);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (apiConfig?.baseUrl && apiConfig?.apiKey) {
      const fetchTags = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${apiConfig.baseUrl}/tag?page_number=1&page_size=100`, {
            headers: {
              'Authorization': `Bearer ${apiConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            if (data?.data?.tags && Array.isArray(data.data.tags)) {
              setTags(data.data.tags);
            }
          } else {
            setTags([]);
            if (response.status === 401 || response.status === 403) {
              toast({
                variant: 'destructive',
                title: 'Error',
                description: 'apiKey expires'
              });
            } else {
              toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to fetch tags'
              });
            }
          }
        } catch (error) {
          console.error('Failed to fetch tags', error);
          setTags([]);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'apiKey expires or network error'
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchTags();
    } else {
      setTags([]);
      if (apiConfig?.baseUrl) {
        toast({
          variant: 'destructive',
          title: 'Configuration Error',
          description: 'API Key missing'
        });
      }
    }
  }, [apiConfig]);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckedChange = (tag: Tag, checked: boolean) => {
    if (checked) {
      if (!selectedTags.find((t) => t.id === tag.id)) {
        onTagsChange([...selectedTags, tag]);
      }
    } else {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
    }
  };

  const removeTag = (id: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== id));
  };

  return (
    <div>
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className='w-full justify-start border-gray-200 text-black bg-white hover:text-black hover:bg-transparent'
          >
            <div className='flex justify-between w-full font-light'>
              <p>Select Tags</p>
              <ChevronDown strokeWidth={1} size={18} />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='min-w-[18rem] bg-white'>
          <>
            <div className='flex items-center p-2'>
              <Input
                placeholder='Search tags'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='flex-1'
              />
            </div>

            <DropdownMenuSeparator />
            <div className='max-h-40 overflow-y-auto'>
              {isLoading ? (
                <div className='flex justify-center py-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                </div>
              ) : (
                filteredTags.map((tag) => {
                  const isChecked = selectedTags.some((t) => t.id === tag.id);
                  return (
                    <DropdownMenuCheckboxItem
                      key={tag.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleCheckedChange(tag, checked)
                      }
                      onPointerDown={(e) => e.stopPropagation()}>
                      {tag.name}
                    </DropdownMenuCheckboxItem>
                  );
                })
              )}

            </div>
          </>
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedTags.length > 0 && (
        <div className='mt-2 flex flex-wrap gap-2'>
          {selectedTags.map((tag) => (
            <div
              key={tag.id}
              className='flex items-center px-2 py-1 bg-gray-200 rounded-md'>
              <span className='text-sm text-black'>{tag.name}</span>
              <X
                size={14}
                onClick={() => removeTag(tag.id)}
                className='ml-1 cursor-pointer text-gray-600 hover:text-black'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

