import { FileMinus, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
// import { TypographyH3 } from '@/components/ui/typography';

// Substituting TypographyP with a span/div or H3 depending on needs, 
// but sticking to standard HTML for simplicity if TypographyP is missing in naxie
// Or I can add TypographyP to naxie if needed. For now using basic text.

interface FilePreviewProps {
  selectedFiles: File[];
  setSelectedFiles: (val: File[]) => void;
  percentage: number;
}

export default function FilePreview({
  selectedFiles,
  setSelectedFiles,
  percentage,
}: FilePreviewProps) {
  const [progress, setProgress] = useState(percentage);

  const handleRemove = (fileName: string) => {
    const temp = selectedFiles.filter((file) => file.name !== fileName);
    setSelectedFiles(temp);
  };

  useEffect(() => {
    setProgress(percentage);
  }, [percentage]);

  return (
    <div>
      {selectedFiles.length > 0 &&
        selectedFiles.map((file, index) => (
          <div key={index} className='mt-3  border  bg-white rounded-md '>
            <div className=' flex justify-between items-center  m-1'>
              <div className='flex  items-center '>
                <FileMinus
                  color='white'
                  fill='red'
                  size={26}
                  strokeWidth={1}
                  className='ml-2'
                />
                <p className='pl-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] text-sm'>
                  {file?.name}
                </p>
              </div>
              {percentage === 0 && (
                <X
                  className='mr-2 cursor-pointer'
                  size={16}
                  onClick={() => handleRemove(file?.name)}
                />
              )}
            </div>
            {percentage !== 0 && (
              <Progress value={progress} className='w-[95%] m-1 ml-3' />
            )}
          </div>
        ))}
    </div>
  );
}
