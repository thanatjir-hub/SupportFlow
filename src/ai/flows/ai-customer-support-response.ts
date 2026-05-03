'use server';
/**
 * @fileOverview This file implements a Genkit flow for an AI customer support bot with Google Sheets integration.
 * It uses Genkit Tools to fetch external knowledge from a spreadsheet.
 *
 * - aiCustomerSupportResponse - The main function to interact with the AI customer support bot.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * Input schema for the AI customer support response flow.
 */
const AiCustomerSupportResponseInputSchema = z.object({
  message: z.string().min(2).describe('The customer\'s message or query.'),
  customer_name: z.string().optional().describe('The name of the customer, if available.'),
  company_name: z.string().describe('The name of the company.'),
  company_info: z.string().describe('Detailed information about the company.'),
  support_email: z.string().email().describe('The support email for the company.'),
});
export type AiCustomerSupportResponseInput = z.infer<typeof AiCustomerSupportResponseInputSchema>;

/**
 * Output schema for the AI customer support response flow.
 */
const AiCustomerSupportResponseOutputSchema = z.object({
  answer: z.string().describe('The AI\'s response to the customer\'s query.'),
  confidence: z.number().min(0.0).max(1.0).describe('A confidence score (0.0-1.0) for the AI\'s answer.'),
  category: z.enum(['faq', 'billing', 'technical', 'complaint', 'other']).describe('The category of the customer\'s query.'),
});
export type AiCustomerSupportResponseOutput = z.infer<typeof AiCustomerSupportResponseOutputSchema>;

/**
 * Tool to fetch knowledge from the provided Google Sheet.
 */
const queryGoogleSheet = ai.defineTool(
  {
    name: 'queryGoogleSheet',
    description: 'Searches the company knowledge base in the Google Spreadsheet for answers to customer questions.',
    inputSchema: z.object({
      query: z.string().describe('The specific keyword or topic to search for in the spreadsheet.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQTVA1QFJXqOCD1rk-LL9usqGYOYgNb0l199MvJ4t46_eV5PbmSY2FQ0SpGrwOKuu-iSXYWFo2-X3vq/pub?output=csv';
    
    try {
      const response = await fetch(url);
      if (!response.ok) return "Cannot access the spreadsheet right now.";
      
      const csvText = await response.text();
      const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (lines.length === 0) return "The knowledge base is empty.";

      const header = lines[0];
      const dataLines = lines.slice(1);

      // Simple keyword search
      const queryWords = input.query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
      
      let matchingLines = dataLines.filter(line => {
        const lowerLine = line.toLowerCase();
        return queryWords.some(word => lowerLine.includes(word));
      });

      // If no match found, provide the first few lines as context anyway
      if (matchingLines.length === 0) {
        matchingLines = dataLines.slice(0, 10);
      }

      return `Format (Header): ${header}\n\nRelevant Data Found:\n${matchingLines.join('\n')}`;
    } catch (error) {
      return "Error fetching data from Google Sheets.";
    }
  }
);

/**
 * Defines the prompt for the AI customer support assistant.
 */
const customerSupportPrompt = ai.definePrompt({
  name: 'customerSupportPrompt',
  input: { schema: AiCustomerSupportResponseInputSchema },
  output: { schema: AiCustomerSupportResponseOutputSchema },
  tools: [queryGoogleSheet],
  prompt: `You are a professional customer support assistant for {{company_name}}.

Company Context:
{{{company_info}}}

Your task:
1. Answer the customer's question accurately using the provided context.
2. If the answer is not in the "Company Context", use the 'queryGoogleSheet' tool to search for specific details.
3. When using 'queryGoogleSheet', look at the "Relevant Data Found" and the "Header" to understand the info.
4. If you find the info in the sheet, summarize it politely.
5. If the info is absolutely not found in either source, say: "ขออภัยครับ ผมยังไม่มีข้อมูลส่วนนี้ในขณะนี้ รบกวนติดต่อเราได้ที่ {{support_email}} ครับ"
6. Answer in the same language as the customer (primarily Thai).
7. Keep responses helpful and concise.

Customer ({{customer_name}}):
{{{message}}}`,
});

/**
 * Defines the Genkit flow for processing AI customer support requests.
 */
const aiCustomerSupportResponseFlow = ai.defineFlow(
  {
    name: 'aiCustomerSupportResponseFlow',
    inputSchema: AiCustomerSupportResponseInputSchema,
    outputSchema: AiCustomerSupportResponseOutputSchema,
  },
  async (input) => {
    const { output } = await customerSupportPrompt(input);
    return output || {
      answer: 'เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้งครับ',
      confidence: 0,
      category: 'other',
    };
  }
);

export async function aiCustomerSupportResponse(input: AiCustomerSupportResponseInput): Promise<AiCustomerSupportResponseOutput> {
  return aiCustomerSupportResponseFlow(input);
}
