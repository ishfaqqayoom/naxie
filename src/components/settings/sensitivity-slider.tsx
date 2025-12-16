import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';
import { TypographyP } from '@/components/ui/typography';

interface SensitivitySliderProps {
  value: number; // 0-100 roughly
  onChange: (value: number) => void; 
}

export function SensitivitySlider({ value, onChange }: SensitivitySliderProps) {
  const [sliderValue, setSliderValue] = useState([value]);
  const [points, setPoints] = useState(0.7);

  useEffect(() => {
    setSliderValue([value]);
    const recalculatedPoints = parseFloat(
      (0.1 + (value - 1) * (0.89 / 99)).toFixed(2)
    );
    setPoints(recalculatedPoints);
  }, [value]);

  const handleChange = (newValue: number[]) => {
    setSliderValue(newValue);
    onChange(newValue[0]);
    const calculatedPoints = parseFloat(
      (0.1 + (newValue[0] - 1) * (0.89 / 99)).toFixed(2)
    );
    setPoints(calculatedPoints);
  };

  return (
    <div>
      <Slider
        value={sliderValue}
        max={100}
        step={1}
        className={cn('w-[100%]')}
        onValueChange={handleChange}
      />
      <TypographyP className='text-xs mt-1'>Points: {points}</TypographyP>
    </div>
  );
}
