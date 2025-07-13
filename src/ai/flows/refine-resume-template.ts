'use server';

/**
 * @fileOverview AI flow to refine an existing resume template based on user feedback.
 *
 * - refineResumeTemplate - A function that refines a resume template.
 */

import {ai} from '@/ai/genkit';
import { 
    RefineResumeTemplateInputSchema, 
    RefineResumeTemplateOutputSchema,
    type RefineResumeTemplateInput,
    type RefineResumeTemplateOutput
} from '@/ai/schemas/refine-resume-template-schemas';

export async function refineResumeTemplate(
  input: RefineResumeTemplateInput
): Promise<RefineResumeTemplateOutput> {
  return refineResumeTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineResumeTemplatePrompt',
  input: {schema: RefineResumeTemplateInputSchema},
  output: {schema: RefineResumeTemplateOutputSchema},
  prompt: `You are an expert resume template designer. You will be given the current HTML and CSS of a resume, along with user feedback. Your task is to modify the HTML and CSS to incorporate the user's requested changes.

**CRITICAL INSTRUCTIONS:**
1.  **Analyze Feedback:** Carefully read the user's feedback to understand the requested changes.
2.  **Modify Code:** Apply the changes directly to the provided HTML and CSS. Do not generate new code from scratch; modify the existing structure and styles.
3.  **Preserve Placeholders:** Do not change any placeholder content (like "John Doe", job titles, etc.) unless specifically asked to.
4.  **Ensure Readability:** Maintain high color contrast between text and background colors.
5.  **Output Complete Code:** Return the complete, modified HTML and CSS. Do not return partial snippets or explanations.

**Current HTML:**
\`\`\`html
{{{html}}}
\`\`\`

**Current CSS:**
\`\`\`css
{{{css}}}
\`\`\`

**User Feedback:**
"{{{feedback}}}"

Now, generate the refined HTML and CSS based on the user's feedback.`,
});

const refineResumeTemplateFlow = ai.defineFlow(
  {
    name: 'refineResumeTemplateFlow',
    inputSchema: RefineResumeTemplateInputSchema,
    outputSchema: RefineResumeTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to refine resume template from AI.');
    }

    // Clean up markdown code blocks if the AI includes them
    const cleanedCss = output.css.replace(/```(css)?/g, '').trim();
    const cleanedHtml = output.html.replace(/```(html)?/g, '').trim();

    return { css: cleanedCss, html: cleanedHtml };
  }
);
