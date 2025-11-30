import { Agent, tool } from '@openai/agents';
import { aisdk } from '@openai/agents-extensions';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { generateAnswer } from './gemini';

// Define the tool to search the Gemini File Store
const searchGeminiStore = tool({
    name: 'search_gemini_store',
    description: 'Search the uploaded documents in the Gemini File Store for answers.',
    parameters: z.object({
        query: z.string().describe('The question or query to search for in the documents.'),
    }),
    execute: async ({ query }) => {
        const result = await generateAnswer(query);
        if (result.success) {
            return result.answer || "No answer found in the documents.";
        } else {
            return `Error searching documents: ${result.error}`;
        }
    },
});

// Define the Agent
export const ragAgent = new Agent({
    name: 'RAG Assistant',
    instructions: `You are a helpful assistant designed to answer questions based on uploaded documents.
  
  Your primary tool is 'search_gemini_store'.
  
  use the 'search_gemini_store' tool to find the answer.
  `,
    model: aisdk(google('gemini-2.5-flash')),
    tools: [searchGeminiStore],
});
