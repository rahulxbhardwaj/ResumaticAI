// Summarize resume feedback and refine the template based on user input.
'use server';

/**
 * @fileOverview Summarizes user feedback on a generated resume template.
 *
 * - summarizeResumeFeedback - A function that summarizes user feedback.
 * - SummarizeResumeFeedbackInput - The input type for the summarizeResumeFeedback function.
 * - SummarizeResumeFeedbackOutput - The return type for the summarizeResumeFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeResumeFeedbackInputSchema = z.object({
  resumeTemplate: z
    .string()
    .describe('The generated resume template (CSS and content).'),
  userFeedback: z
    .string()
    .describe('The user feedback on the generated resume template.'),
});
export type SummarizeResumeFeedbackInput = z.infer<
  typeof SummarizeResumeFeedbackInputSchema
>;

const SummarizeResumeFeedbackOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the user feedback.'),
  refinedTemplate: z
    .string()
    .describe('The refined resume template incorporating the feedback.'),
});
export type SummarizeResumeFeedbackOutput = z.infer<
  typeof SummarizeResumeFeedbackOutputSchema
>;

export async function summarizeResumeFeedback(
  input: SummarizeResumeFeedbackInput
): Promise<SummarizeResumeFeedbackOutput> {
  return summarizeResumeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeResumeFeedbackPrompt',
  input: {schema: SummarizeResumeFeedbackInputSchema},
  output: {schema: SummarizeResumeFeedbackOutputSchema},
  prompt: `You are an AI expert in resume generation and feedback analysis.

You will receive a resume template and user feedback on the template.
Your task is to summarize the feedback and refine the template based on the feedback.

Resume Template:
{{{resumeTemplate}}}

User Feedback:
{{{userFeedback}}}

Summary of Feedback:
{{summary}}

Refined Resume Template:
{{refinedTemplate}}`,
});

const summarizeResumeFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizeResumeFeedbackFlow',
    inputSchema: SummarizeResumeFeedbackInputSchema,
    outputSchema: SummarizeResumeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
