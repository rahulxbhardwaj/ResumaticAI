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
  css: z.string().describe('The complete CSS for the resume template. It should be self-contained and not require external fonts or resources.'),
  design: z.string().describe('The complete inner HTML for the resume template. All content should be editable. Use placeholder text for personal information.'),
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
  prompt: `You are an expert resume template designer with knowledge of corporate branding. Your task is to generate the complete HTML body content and CSS for a resume based on a user's prompt.

**CRITICAL INSTRUCTIONS:**
1.  **Analyze for Company Name:** First, analyze the user's prompt to identify if a specific company is mentioned (e.g., "Google", "Spotify", "Netflix").
2.  **Research Branding:** If a company is identified, use your knowledge to research its branding.
    *   **Colors:** Identify the company's primary and secondary brand colors. Incorporate these into the CSS for headings, accents, and links.
    *   **Logo:** Determine the company's logo. You don't need to embed the actual logo file, but you should design a space for it in the HTML header, perhaps with placeholder text like "[Company Logo]".
    *   **Style:** Emulate the company's general design aesthetic (e.g., modern, minimalist, playful, corporate).
3.  **Generate HTML (design):** Create the full inner HTML for a standard A4-sized resume.
    *   The HTML must be self-contained within a single top-level div.
    *   All text elements (names, titles, descriptions) must be directly editable.
    *   Use common placeholder text like "John Doe", "Your Address", "Company Name", etc.
4.  **Generate CSS (css):** Create the complete CSS for the template.
    *   The CSS must be self-contained. Do not use @import or link to external stylesheets. Use common web-safe fonts.
    *   The CSS must professionally style the HTML to fit an A4 page (210mm x 297mm).
    *   If a company was identified, the color scheme and typography should reflect its branding. If not, create a tasteful, modern design.

**User Prompt:**
"{{{prompt}}}"

---
Now, generate the CSS and HTML based on the user's prompt and your branding research.`,
});

const generateResumeTemplateFlow = ai.defineFlow(
  {
    name: 'generateResumeTemplateFlow',
    inputSchema: GenerateResumeTemplateInputSchema,
    outputSchema: GenerateResumeTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate resume template from AI.");
    }

    // Clean up markdown code blocks if the AI includes them
    const cleanedCss = output.css.replace(/```(css)?/g, '').trim();
    const cleanedHtml = output.design.replace(/```(html)?/g, '').trim();

    return { css: cleanedCss, design: cleanedHtml };
  }
);
