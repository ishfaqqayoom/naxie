import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ApiConfig } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface Domain {
  id: string;
  name: string;
}

interface SelectDomainProps {
  selectedDomain?: Domain;
  onSelect: (domain: Domain) => void;
  availableDomains?: Domain[];
  apiConfig?: ApiConfig;
}

export function SelectDomain({
  selectedDomain,
  onSelect,
  availableDomains = [],
  apiConfig,
}: SelectDomainProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [domains, setDomains] = useState<Domain[]>(availableDomains);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (apiConfig?.baseUrl && apiConfig?.apiKey) {
      const fetchDomains = async () => {
        setIsLoading(true);
        try {
          // Endpoint from Cognax: domain?page_number=1&page_size=10
          const response = await fetch(`${apiConfig.baseUrl}/domain?page_number=1&page_size=100`, {
            headers: {
              'Authorization': `Bearer ${apiConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            if (data?.data?.domains && Array.isArray(data.data.domains)) {
              // Cognax returns { data: [...], count: ... }
              setDomains(data.data.domains);
            }
          } else {
            setDomains([]);
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
                description: 'Failed to fetch domains'
              });
            }
          }
        } catch (error) {
          console.error('Failed to fetch domains', error);
          setDomains([]);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'apiKey expires or network error'
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchDomains();
    } else {
      setDomains([]);
      if (apiConfig?.baseUrl) {
        toast({
          variant: 'destructive',
          title: 'Configuration Error',
          description: 'API Key missing'
        });
      }
    }
  }, [apiConfig, toast]);

  const filteredDomains = domains.filter((dom) =>
    dom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleValueChange = (val: string) => {
    try {
      const domain = JSON.parse(val);
      onSelect(domain);
    } catch (e) {
      console.error('Failed to parse domain', e);
    }
  };

  return (
    <Select
      value={selectedDomain ? JSON.stringify(selectedDomain) : ''}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a domain'>
          {selectedDomain?.name || 'Select a domain'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <>
          <div className='flex items-center p-2'>
            <Input
              placeholder='Search domains'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='flex-1'
              disabled={isLoading}
            />
          </div>
          <div className='overflow-y-auto max-h-48 '>
            <SelectGroup>
              {isLoading && (
                <div className='flex justify-center py-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                </div>
              )}

              {filteredDomains.map((dom) => {
                const isSelected = selectedDomain?.id === dom.id;
                return (
                  <SelectItem
                    key={dom.id}
                    value={JSON.stringify(dom)}
                    className='flex justify-between items-center w-full'>
                    <div className='flex items-center justify-between w-full'>
                      <span>{dom.name}</span>
                      {isSelected && (
                        <Check className='w-4 h-4 ml-2 text-black-500' />
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </div>
        </>
      </SelectContent>
    </Select>
  );
}

