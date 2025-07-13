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
  prompt: `You are an expert resume template designer. Your task is to generate the complete HTML body content and CSS for a resume based on a user's prompt. The output must be ready to be rendered in a browser.

**Instructions:**
1.  **HTML (design):** Create the full inner HTML for a standard A4-sized resume.
    *   The HTML should be self-contained within a single top-level div.
    *   All text elements (names, titles, descriptions, etc.) must be directly editable. Do not wrap them in other elements unnecessarily.
    *   Use common placeholder text like "John Doe", "Your Address", "Company Name", etc.
    *   The HTML structure should be semantic and well-organized.
2.  **CSS (css):** Create the complete CSS for the template.
    *   The CSS must be self-contained. Do not use @import or link to external stylesheets or fonts. Use common web-safe fonts.
    *   The CSS should style the HTML to be professional and visually appealing, matching the user's prompt.
    *   Ensure the layout fits a standard A4 page (210mm x 297mm).

**User Prompt:**
"{{{prompt}}}"

**Example Structure:**
---
**CSS:**
\`\`\`css
body { font-family: Arial, sans-serif; }
.resume-container { padding: 2rem; }
/* ... more css ... */
\`\`\`

**Design (HTML):**
\`\`\`html
<div>
  <header>
    <h1>John Doe</h1>
    <p>Software Engineer</p>
  </header>
  <section>
    <h2>Experience</h2>
    <!-- ... more html sections ... -->
  </section>
</div>
\`\`\`
---

Now, generate the CSS and HTML based on the user's prompt above.`,
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
