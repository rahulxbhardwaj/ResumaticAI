'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateResumeAction } from '@/app/actions';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { ResumePreview } from '@/components/ResumePreview';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const loadingMessages = [
    'Drafting your resume...',
    'Designing the layout...',
    'Incorporating branding...',
    'Polishing the final details...',
];

export default function Home() {
  const [resumeData, setResumeData] = useState<{ html: string; css: string } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isPending, startTransition] = useTransition();
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPending) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => {
      clearInterval(interval);
      setLoadingMessageIndex(0);
    };
  }, [isPending]);

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
    setResumeData(null);
    setPrompt('');
  };
  
  return (
    <main className="min-h-screen w-full bg-background transition-colors duration-300">
      {resumeData ? (
        <ResumePreview 
          initialHtmlContent={resumeData.html}
          initialCssContent={resumeData.css}
          onNewPrompt={handleNewPrompt}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
           <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <Wand2 className="h-8 w-8 text-primary" />
                        <CardTitle className="text-3xl font-bold tracking-tight">ResumaticAI</CardTitle>
                    </div>
                    <CardDescription className="text-lg">
                        Describe the role, company, and style you're aiming for. Our AI will craft a unique, professional resume template just for you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder='e.g., "A modern resume for a Senior Product Manager at Google. Clean, professional, and uses a single column layout."'
                        rows={5}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isPending}
                        className="text-base"
                    />
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerate} disabled={isPending} className="w-full text-base py-6">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                {loadingMessages[loadingMessageIndex]}
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Generate with AI
                            </>
                        )}
                    </Button>
                </CardFooter>
           </Card>
        </div>
      )}
    </main>
  );
}
