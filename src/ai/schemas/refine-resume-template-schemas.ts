import { z } from 'zod';

/**
 * @fileOverview Zod schemas and TypeScript types for the refineResumeTemplate AI flow.
 */

export const RefineResumeTemplateInputSchema = z.object({
  html: z.string().describe('The current HTML content of the resume.'),
  css: z.string().describe('The current CSS styles for the resume.'),
  feedback: z
    .string()
    .min(10, { message: 'Feedback must be at least 10 characters long.' })
    .describe(
      'The user\'s feedback describing the desired changes (e.g., "change the accent color to blue", "make the font larger").'
    ),
});
export type RefineResumeTemplateInput = z.infer<
  typeof RefineResumeTemplateInputSchema
>;

export const RefineResumeTemplateOutputSchema = z.object({
  html: z.string().describe('The complete, updated HTML for the resume template.'),
  css: z.string().describe('The complete, updated CSS for the resume template.'),
});
export type RefineResumeTemplateOutput = z.infer<
  typeof RefineResumeTemplateOutputSchema
>;
