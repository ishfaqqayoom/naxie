import { Button } from '@/components/ui/button';
import { Settings, Undo2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SelectDomain, Domain } from './select-domain';
import { SelectTag, Tag } from './select-tag';
import { SensitivitySlider } from './sensitivity-slider';
import { SelectPrompt } from './select-prompt';
import { ApiConfig } from '@/types';

export interface SettingsState {
  domain?: Domain;
  tags: Tag[];
  sensitivity: number;
  prompt: string;
}

interface SettingPopOverProps {
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
  onReset: () => void;
  apiConfig?: ApiConfig;
}

export function SettingPopOver({
  settings,
  onSettingsChange,
  onReset,
  apiConfig,
}: SettingPopOverProps) {

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Popover>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='m-2 w-10 h-10 rounded-lg border-none p-0 bg-gray-100 text-foreground hover:bg-secondary hover:text-dark flex items-center justify-center'>
                <Settings className='w-4 h-4' />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent className='text-xs'>
            <p>Naxie Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className='w-80 bg-white'>
        <div className='grid gap-2'>
          <div className='mt-1'>
            <SelectDomain
              selectedDomain={settings.domain}
              onSelect={(d) => updateSetting('domain', d)}
              apiConfig={apiConfig}
            />
          </div>
          <div>
            <SelectTag
              selectedTags={settings.tags}
              onTagsChange={(t) => updateSetting('tags', t)}
              apiConfig={apiConfig}
            />
          </div>
          <div className='mt-2'>
            <p className='text-muted-foreground leading-none mb-4 text-sm'>
              Select Sensitivity
            </p>
            <SensitivitySlider
              value={settings.sensitivity}
              onChange={(v) => updateSetting('sensitivity', v)}
            />
          </div>
          <div className='space-y-2 mt-2'>
            <p className='text-muted-foreground leading-none mb-2 text-sm'>
              Select Prompt
            </p>
            <SelectPrompt
              selectedPrompt={settings.prompt}
              onSelect={(p) => updateSetting('prompt', p)}
              apiConfig={apiConfig}
            />
          </div>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='mt-4 mb-2 border border-border w-full'
          onClick={onReset}>
          <Undo2 className='mr-2' size={18} />
          Reset
        </Button>
      </PopoverContent>
    </Popover>
  );
}
