import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FilePreview from './file-preview';
import { RefreshCw } from 'lucide-react';
import React, { useState } from 'react';
import { TypographyP } from './ui/typography';
import { useToast } from '@/hooks/use-toast';
// import { Switch } from '@/components/ui/switch';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { SelectDomain, Domain } from './settings/select-domain';
// import { SelectTag, Tag } from './settings/select-tag';
// import Image from 'next/image'; // Assuming optional or replace with icon

interface InstantFileUploadDialogProps {
  isPopoverOpen: boolean;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpload: (files: File[], metadata: any) => Promise<void>; // Abstract upload logic
}

export function InstantFileUploadDialog({
  isPopoverOpen,
  setIsPopoverOpen,
  onUpload,
}: InstantFileUploadDialogProps) {
  /* Existing code */
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [percentage, setPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // const [domain, setDomain] = useState<Domain>();
  // const [tags, setTags] = useState<Tag[]>([]);
  // const [parsing, setParsing] = useState('Basic Parsing');
  // const [isChecked, setIsChecked] = useState(false);

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      // Basic validation logic...
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
    event.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPercentage(10); // Fake progress for demo

    try {
      await onUpload(selectedFiles, {
        // domain,
        // tags,
        // parsing,
        // addToGalaxy: isChecked,
      });
      setPercentage(100);
      setTimeout(() => {
        setIsPopoverOpen(false);
        setSelectedFiles([]);
        setPercentage(0);
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      console.error('Upload failed', err);
      setIsLoading(false);
      setPercentage(0);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Upload failed'
      });
    }
  };

  return (
    <Dialog open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={false}>
      <DialogContent
        className='z-50 p-0 max-h-[80vh] overflow-y-auto min-w-[32vw] bg-white rounded-md shadow-lg'
        /* onClose prop is missing in some Dialog implementations, handle via open prop changes if needed */
        onClose={() => setIsPopoverOpen(false)}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className='flex justify-between p-4 bg-accent'>
          <TypographyP className='pt-2 flex'>Upload Document</TypographyP>
        </div>

        <div className='px-4 mb-4'>
          <label
            htmlFor='dropzone-file'
            className='flex flex-col  rounded-md items-center justify-evenly h-36 cursor-pointer mt-4 border-2 border-dashed border-gray-300 hover:bg-gray-50 transition-colors'>
            {/* Replace Image with text or icon if image not available */}
            <div className="text-center">
              <p className="font-semibold">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PDF, DOCX, TXT (MAX. 10MB)</p>
            </div>

            <input
              id='dropzone-file'
              type='file'
              accept='.txt, .pdf, .doc, .docx'
              className='hidden'
              multiple
              onChange={onFileSelect}
            />
          </label>
          <hr className="my-4" />

          {/* <div className='flex justify-between items-center space-x-2 my-4'>
            <Label>Add to Document Galaxy</Label>
            <Switch checked={isChecked} onCheckedChange={setIsChecked} />
          </div>

          {isChecked && (
            <div className="space-y-3">
              <div>
                <Label>Parsing Strategy</Label>
                <Select value={parsing} onValueChange={setParsing}>
                  <SelectTrigger className='w-full h-9 mt-1'>
                    <SelectValue>{parsing}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='Basic Parsing'>Basic Parsing</SelectItem>
                      <SelectItem value='Deep Parsing'>Deep Parsing</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                 <Label>Domain</Label>
                 <div className="mt-1">
                    <SelectDomain selectedDomain={domain} onSelect={setDomain} />
                 </div>
              </div>
              <div>
                 <Label>Tags</Label>
                 <div className="mt-1">
                    <SelectTag selectedTags={tags} onTagsChange={setTags} />
                 </div>
              </div>
            </div>
          )} */}

          <FilePreview
            selectedFiles={selectedFiles}
            percentage={percentage}
            setSelectedFiles={setSelectedFiles}
          />

          <div className='flex justify-end w-full pt-4'>
            {selectedFiles.length > 0 && (
              <Button type='button' disabled={isLoading} onClick={handleSubmit}>
                {isLoading ? (
                  <>
                    <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
