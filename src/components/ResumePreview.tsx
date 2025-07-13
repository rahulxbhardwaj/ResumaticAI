'use client';

import { useState, useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, FilePenLine, Loader2, Wand2, Sparkles } from 'lucide-react';
import { refineResumeAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface ResumePreviewProps {
  initialHtmlContent: string;
  initialCssContent: string;
  onNewPrompt: () => void;
}

export function ResumePreview({ initialHtmlContent, initialCssContent, onNewPrompt }: ResumePreviewProps) {
  const [htmlContent, setHtmlContent] = useState(initialHtmlContent);
  const [cssContent, setCssContent] = useState(initialCssContent);
  const [feedback, setFeedback] = useState('');
  const [isPending, startTransition] = useTransition();
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handleDownload = () => {
    window.print();
  };

  const handleRefine = () => {
    if (feedback.trim().length < 10) {
      toast({
        variant: 'destructive',
        title: 'Feedback is too short',
        description: 'Please provide more detailed feedback for the AI.',
      });
      return;
    }

    const currentHtml = resumeContentRef.current?.innerHTML || htmlContent;

    startTransition(async () => {
      const result = await refineResumeAction({
        html: currentHtml,
        css: cssContent,
        feedback,
      });

      if (result.success) {
        setHtmlContent(result.data.html);
        setCssContent(result.data.css);
        setFeedback('');
        toast({
          title: 'Resume Refined!',
          description: 'Your changes have been applied.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Refinement Failed',
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="w-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-[380px] lg:min-w-[380px] bg-card border-r no-print sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 space-y-6">
            <Card>
                <CardHeader>
                    <div className="text-xl font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Live Resume Editor
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <Button variant="outline" onClick={onNewPrompt}>
                        <FilePenLine className="h-4 w-4 mr-2" />
                        New Prompt
                    </Button>
                    <Button onClick={handleDownload}>
                        <FileDown className="h-4 w-4 mr-2" />
                        Download PDF
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="text-xl font-semibold flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-primary" />
                        Refine with AI
                    </div>
                </CardHeader>
                <CardContent>
                     <Textarea
                        placeholder='e.g., "Change the accent color to dark blue" or "Make my name bigger."'
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        disabled={isPending}
                        className="text-base"
                    />
                </CardContent>
                <CardFooter>
                    <Button onClick={handleRefine} disabled={isPending} className="w-full">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Refining...
                            </>
                        ) : (
                            <>
                                Refine Template
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
      
      <div id="resume-preview-container" className="w-full overflow-x-auto bg-gray-100">
        <div className="py-8 mx-auto w-fit">
            <style>{cssContent}</style>
            <div 
              id="resume-preview-content"
              className="w-[210mm] min-h-[297mm] h-fit bg-white text-black shadow-2xl"
            >
                <div
                    ref={resumeContentRef}
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
