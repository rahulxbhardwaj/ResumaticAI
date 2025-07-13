'use server';

import { z } from 'zod';
import { generateResumeTemplate, type GenerateResumeTemplateOutput } from '@/ai/flows/generate-resume-template';

const promptSchema = z.string().min(10, { message: "Prompt must be at least 10 characters long." });

export async function generateResumeAction(prompt: string): Promise<{ success: true; data: GenerateResumeTemplateOutput } | { success: false; error: string }> {
  const validation = promptSchema.safeParse(prompt);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    const result = await generateResumeTemplate({ prompt: validation.data });
    if (!result.css || !result.design) {
        return { success: false, error: "AI failed to generate a complete template. Please try a different prompt." };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("Error generating resume template:", error);
    return { success: false, error: "An unexpected error occurred while generating the resume. Please try again later." };
  }
}
