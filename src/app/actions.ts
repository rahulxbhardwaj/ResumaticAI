'use server';

import { z } from 'zod';
import { generateResumeTemplate, type GenerateResumeTemplateOutput } from '@/ai/flows/generate-resume-template';
import { refineResumeTemplate } from '@/ai/flows/refine-resume-template';
import { RefineResumeTemplateInputSchema, type RefineResumeTemplateOutput } from '@/ai/schemas/refine-resume-template-schemas';

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

export async function refineResumeAction(input: {html: string, css: string, feedback: string}): Promise<{ success: true; data: RefineResumeTemplateOutput } | { success: false; error: string }> {
  const validation = RefineResumeTemplateInputSchema.safeParse(input);
  if (!validation.success) {
    // Return the first error message
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    const result = await refineResumeTemplate(validation.data);
    if (!result.css || !result.html) {
      return { success: false, error: "AI failed to refine the template. Please try again." };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("Error refining resume template:", error);
    return { success: false, error: "An unexpected error occurred while refining the resume. Please try again later." };
  }
}
