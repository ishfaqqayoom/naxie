// import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { ApiConfig } from '@/types';
import { Loader2 } from 'lucide-react';

export interface Prompt {
  id: string;
  name: string; // The content or key
  title: string; // Display title
}

const DEFAULT_PROMPTS: Prompt[] = [
  { id: '1', name: 'Analyze this data provided', title: 'Data Analysis' },
  { id: '2', name: 'Summarize the findings', title: 'Summary' },
  { id: '3', name: 'Generate a report', title: 'Report Generation' },
  { id: '4', name: 'Find anomalies', title: 'Anomaly Detection' },
];

interface SelectPromptProps {
  selectedPrompt: string;
  onSelect: (prompt: string) => void;
  availablePrompts?: Prompt[];
  apiConfig?: ApiConfig;
}

export function SelectPrompt({
  selectedPrompt,
  onSelect,
  availablePrompts = DEFAULT_PROMPTS,
  apiConfig,
}: SelectPromptProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(availablePrompts);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (apiConfig?.baseUrl && apiConfig?.apiKey) {
      const fetchPrompts = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${apiConfig.baseUrl}/prompts?page_number=1&page_size=100`, {
            headers: {
              'Authorization': `Bearer ${apiConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
             if (data?.data?.prompts && Array.isArray(data.data.prompts)) {
                 setPrompts(data.data.prompts);
             }
          }
        } catch (error) {
           console.error('Failed to fetch prompts', error);
        } finally {
            setIsLoading(false);
        }
      };
      fetchPrompts();
    }
  }, [apiConfig]);

  return (
    <div>
      <Select onValueChange={onSelect} value={selectedPrompt}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select an existing prompt' />
        </SelectTrigger>
        <SelectContent>
            {isLoading ? (
                <div className='flex justify-center py-2'>
                    <Loader2 className='w-4 h-4 animate-spin' />
                </div>
            ) : (
                <SelectGroup>
                    <SelectLabel>Prompt List</SelectLabel>
                    {prompts.map((prompt) => (
                    <SelectItem
                        key={prompt.id}
                        value={prompt.name}
                        className='flex justify-between items-center w-full'>
                        <div>{prompt.title}</div>
                    </SelectItem>
                    ))}
                </SelectGroup>
            )}
        
        </SelectContent>
      </Select>
    </div>
  );
}
