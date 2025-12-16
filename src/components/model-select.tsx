import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';
import { ApiConfig } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface ModelDetails {
  id: string;
  name: string;
  capabilities: string[];
  tags?: string[];
}

interface ModelSelectProps {
  initialModel?: string;
  onModelSelect?: (modelDetails: ModelDetails) => void;
  availableModels?: ModelDetails[];
  apiConfig?: ApiConfig;
}

export function ModelSelect({
  initialModel = 'gpt-4',
  onModelSelect,
  availableModels = [],
  apiConfig,
}: ModelSelectProps) {
  const [selectedModel, setSelectedModel] = useState<string>(initialModel);
  const [models, setModels] = useState<ModelDetails[]>(availableModels);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (apiConfig?.baseUrl && apiConfig?.apiKey) {
      const fetchModels = async () => {
        setLoading(true);
        try {
          // Using the endpoint from Cognax: /naxie/naxie-models
          const response = await fetch(`${apiConfig.baseUrl}/naxie/naxie-models`, {
            headers: {
              'Authorization': `Bearer ${apiConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            if (data?.models && Array.isArray(data.models)) {
              const apiModels: ModelDetails[] = data.models.map((m: any) => ({
                id: m.name, // Mapping 'name' to 'id' as per Cognax implementation
                name: m.name,
                capabilities: Array.isArray(m.capabilities) ? m.capabilities : [],
                tags: Array.isArray(m.tags) ? m.tags : []
              }));
              setModels(apiModels);
              // Set default if not set
              if (apiModels.length > 0 && !apiModels.find(m => m.id === selectedModel)) {
                setSelectedModel(apiModels[0].id);
                onModelSelect?.(apiModels[0]);
              }
            }
          } else {
            setModels([]);
            if (response.status === 401 || response.status === 403) {
              toast({
                variant: 'destructive',
                title: 'Error',
                description: 'apiKey expires or invalid'
              });
            } else {
              toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load models'
              });
            }
            console.error('Failed to fetch models', response.statusText);
          }
        } catch (error) {
          setModels([]);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'apiKey expires or network error'
          });
          console.error('Error fetching models:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchModels();
    } else {
      // No API Config or Key
      setModels([]);
      // Only show toast if we expected to work? Or just silent? User said "when user tries to call api". 
      // If the component mounts and no key is present, it's ambiguous if that's a "call".
      // But if we want to warn them configuration is missing:
      if (apiConfig?.baseUrl) { // If baseUrl exists but key missing, warn.
        toast({
          variant: 'destructive',
          title: 'Configuration Error',
          description: 'API Key missing'
        });
      }
    }
  }, [apiConfig]);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    if (onModelSelect) {
      const model = models.find((m) => m.id === modelId);
      if (model) {
        onModelSelect(model);
      }
    }
  };

  return (
    <Select value={selectedModel} onValueChange={handleModelChange}>
      <SelectTrigger className='w-[140px] h-10 bg-gray-100 border-none hover:bg-secondary hover:text-dark'>
        <div className='flex items-center space-x-2'>
          <Sparkles size={16} />
          <SelectValue>
            {loading ? 'Loading...' : (models.find((model) => model.id === selectedModel)?.name ||
              selectedModel)}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <div className="flex justify-center p-2"><Loader2 className="animate-spin h-4 w-4" /></div>
        ) : (
          models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className='flex flex-col text-left'>
                <span className='font-medium'>{model.name}</span>
                {model.tags && (
                  <span className='text-xs text-gray-500'>
                    {model.tags.join(' • ')}
                  </span>
                )}
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

