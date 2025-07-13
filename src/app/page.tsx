'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateResumeAction } from '@/app/actions';
import { Loader2, Sparkles } from 'lucide-react';
import { ResumePreview } from '@/components/ResumePreview';

export default function Home() {
  const [resumeData, setResumeData] = useState<{ html: string; css: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (!resumeData) {
      setIsDialogOpen(true);
    }
  }, [resumeData]);

  const handleGenerate = () => {
    if (prompt.trim().length < 10) {
      toast({
        variant: 'destructive',
        title: 'Prompt is too short',
        description: 'Please provide a more detailed description for your resume design.',
      });
      return;
    }

    startTransition(async () => {
      const result = await generateResumeAction(prompt);
      if (result.success) {
        setResumeData({ html: result.data.design, css: result.data.css });
        setIsDialogOpen(false);
        toast({
          title: 'Success!',
          description: 'Your new resume is ready to be edited.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: result.error,
        });
      }
    });
  };

  const handleNewPrompt = () => {
    setPrompt('');
    setIsDialogOpen(true);
  };
  
  return (
    <main className="min-h-screen w-full bg-background transition-colors duration-300">
      {resumeData ? (
        <ResumePreview 
          htmlContent={resumeData.html}
          cssContent={resumeData.css}
          onNewPrompt={handleNewPrompt}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
            {!isDialogOpen && (
                <Button size="lg" onClick={() => setIsDialogOpen(true)}>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Your Resume
                </Button>
            )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={isDialogOpen && resumeData ? setIsDialogOpen : undefined}>
        <DialogContent className="sm:max-w-[525px] no-print">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="text-accent" />
              Describe Your Perfect Resume
            </DialogTitle>
            <DialogDescription>
              Tell our AI the role, company, and style you're aiming for. The more detail, the better!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder='e.g., "A modern resume for a Senior Product Manager at Google. Clean, professional, and uses a single column layout."'
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleGenerate} disabled={isPending} className="w-full text-base py-6">
              {isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              Generate with AI
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
