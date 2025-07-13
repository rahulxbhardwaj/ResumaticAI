'use server';
/**
 * @fileOverview A tool to get a company's logo from its name.
 *
 * - getCompanyLogo - A Genkit tool that finds a company's domain and returns a logo URL.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const getCompanyLogoInputSchema = z.object({
  companyName: z.string().describe("The name of the company to find the logo for."),
});

const getCompanyLogoOutputSchema = z.string().url().describe("The URL of the company's logo.");

const companyDomainPrompt = ai.definePrompt({
  name: 'getCompanyDomainPrompt',
  input: { schema: getCompanyLogoInputSchema },
  output: { schema: z.object({ domain: z.string().describe("The official domain of the company (e.g., 'google.com', 'spotify.com').") }) },
  prompt: `What is the official domain for the company named "{{companyName}}"? Please provide only the domain name.`,
});

export const getCompanyLogo = ai.defineTool(
  {
    name: 'getCompanyLogo',
    description: "Gets a company's logo URL from its name. It first determines the company's domain and then uses the Clearbit logo API to fetch the image.",
    inputSchema: getCompanyLogoInputSchema,
    outputSchema: getCompanyLogoOutputSchema,
  },
  async ({ companyName }) => {
    console.log(`[getCompanyLogo] Finding domain for: ${companyName}`);
    try {
      const { output } = await companyDomainPrompt({ companyName });
      if (!output?.domain) {
        console.warn(`[getCompanyLogo] Could not determine domain for ${companyName}.`);
        return "";
      }
      const domain = output.domain;
      console.log(`[getCompanyLogo] Found domain: ${domain}`);
      const logoUrl = `https://logo.clearbit.com/${domain}`;
      return logoUrl;
    } catch (error) {
      console.error(`[getCompanyLogo] Error fetching logo for ${companyName}:`, error);
      return ""; // Return empty string on error to not break the flow
    }
  }
);
