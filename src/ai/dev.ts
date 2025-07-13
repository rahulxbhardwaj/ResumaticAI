import { config } from 'dotenv';
config();

import '@/ai/flows/generate-resume-template.ts';
import '@/ai/flows/refine-resume-template.ts';
import '@/ai/flows/summarize-resume-feedback.ts';
import '@/ai/tools/get-company-logo.ts';
