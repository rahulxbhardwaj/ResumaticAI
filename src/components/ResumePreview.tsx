'use client';

import { Button } from '@/components/ui/button';
import { FileDown, FilePenLine } from 'lucide-react';

interface ResumePreviewProps {
  htmlContent: string;
  cssContent: string;
  onNewPrompt: () => void;
}

export function ResumePreview({ htmlContent, cssContent, onNewPrompt }: ResumePreviewProps) {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="no-print w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sticky top-4 z-10">
        <div className="bg-card/60 backdrop-blur-lg border rounded-lg p-3 flex items-center justify-between shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight">Live Resume Editor</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onNewPrompt}>
                <FilePenLine className="h-4 w-4 mr-2" />
                New Prompt
              </Button>
              <Button onClick={handleDownload}>
                <FileDown className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
        </div>
      </div>
      
      <div id="resume-preview-container" className="w-full overflow-x-auto">
        <div className="py-8 mx-auto w-fit">
            <style>{cssContent}</style>
            <div 
              id="resume-preview-content"
              className="w-[210mm] min-h-[297mm] h-fit bg-white text-black shadow-2xl"
            >
                <div
                    contentEditable
                    suppressContentEditableWarning
                    className="w-full h-full outline-none"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </div>
        </div>
      </div>
    </div>
  );
}
