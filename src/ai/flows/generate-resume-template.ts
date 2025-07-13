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
  prompt: `You are an expert resume template designer with knowledge of corporate branding and modern UI/UX principles. Your task is to generate the complete HTML body content and CSS for a resume based on a user's prompt.

**CRITICAL INSTRUCTIONS:**
1.  **Analyze for Company Name:** First, analyze the user's prompt to identify if a specific company is mentioned (e.g., "Google", "Spotify", "Netflix").
2.  **Research Branding:** If a company is identified, use your knowledge to research its branding.
    *   **Colors:** Identify the company's primary and secondary brand colors. Incorporate these into the CSS for headings, accents, and links.
    *   **Style:** Emulate the company's general design aesthetic (e.g., modern, minimalist, playful, corporate).
3.  **Incorporate Professional UI Elements:** The design must be professional, unique, and visually appealing.
    *   **Layout:** Use a two-column layout. The main content (Experience, Education) should be in the wider column, and sidebar content (Contact, Skills) in the narrower one.
    *   **Sections:** Style each major section (e.g., Experience, Skills) as a distinct "card" with a subtle 'box-shadow' and 'border-radius'.
    *   **Icons:** For the contact section (email, phone, LinkedIn, portfolio), use placeholder text or simple Unicode characters to represent icons (e.g., 📧, 📞, 🔗). Style them to appear next to the text.
    *   **Skill Bars:** For the "Skills" section, represent skill proficiency using horizontal progress bars. Create a simple 'div' structure for the bar and its fill, and style it with CSS.
4.  **Generate HTML (design):** Create the full inner HTML for a standard A4-sized resume.
    *   The HTML must be self-contained within a single top-level div.
    *   All text elements (names, titles, descriptions) must be directly editable. Use placeholders like "John Doe", "Your Address", etc.
5.  **Generate CSS (css):** Create the complete CSS for the template.
    *   The CSS must be self-contained. Do not use @import or link to external stylesheets. Use common web-safe fonts.
    *   The CSS must professionally style the HTML to fit an A4 page (210mm x 297mm).
    *   The styling must be responsive and clean.

**User Prompt:**
"{{{prompt}}}"

---
Now, generate the CSS and HTML based on the user's prompt and your design instructions. Ensure the final output is polished and professional.`,
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
