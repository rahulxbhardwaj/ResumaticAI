'use server';

/**
 * @fileOverview AI flow to generate resume templates based on user prompts.
 *
 * - generateResumeTemplate - A function that generates a resume template based on a user prompt.
 * - GenerateResumeTemplateInput - The input type for the generateResumeTemplate function.
 * - GenerateResumeTemplateOutput - The return type for the generateResumeTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeTemplateInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A prompt describing the desired resume style (e.g., \'modern tech resume\', \'resume for a marketing role at Google\').'
    ),
});
export type GenerateResumeTemplateInput = z.infer<
  typeof GenerateResumeTemplateInputSchema
>;

const GenerateResumeTemplateOutputSchema = z.object({
  css: z.string().describe('The CSS for the resume template.'),
  design: z.string().describe('The design of the resume template.'),
});
export type GenerateResumeTemplateOutput = z.infer<
  typeof GenerateResumeTemplateOutputSchema
>;

export async function generateResumeTemplate(
  input: GenerateResumeTemplateInput
): Promise<GenerateResumeTemplateOutput> {
  return generateResumeTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumeTemplatePrompt',
  input: {schema: GenerateResumeTemplateInputSchema},
  output: {schema: GenerateResumeTemplateOutputSchema},
  prompt: `You are an expert resume template designer.

You will generate CSS and design elements for a resume template based on the user's prompt.

User Prompt: {{{prompt}}}

CSS:
Design: `,
});

const generateResumeTemplateFlow = ai.defineFlow(
  {
    name: 'generateResumeTemplateFlow',
    inputSchema: GenerateResumeTemplateInputSchema,
    outputSchema: GenerateResumeTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
