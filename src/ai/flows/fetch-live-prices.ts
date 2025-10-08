'use server';

/**
 * @fileOverview Fetches live prices for POL/MATIC to USD.
 *
 * - fetchLivePrices - A function that fetches the live prices.
 * - FetchLivePricesOutput - The return type for the fetchLivePrices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchLivePricesOutputSchema = z.object({
  maticUsd: z.number().describe('The live price of POL/MATIC in USD.'),
  usdtUsd: z.number().describe('The live price of USDT in USD.'),
});
export type FetchLivePricesOutput = z.infer<typeof FetchLivePricesOutputSchema>;

export async function fetchLivePrices(): Promise<FetchLivePricesOutput> {
  return fetchLivePricesFlow();
}

const getLivePrices = ai.defineTool({
  name: 'getLivePrices',
  description: 'Fetches the live prices for POL/MATIC and USDT in USD from an external API.',
  inputSchema: z.void(),
  outputSchema: z.object({
    'polygon-ecosystem-token': z.object({
      usd: z.number(),
    }),
    'usd-coin': z.object({
      usd: z.number(),
    }),
  }),
  async (input) => {
    const apiUrl = process.env.VITE_PRICE_API_URL;
    if (!apiUrl) {
      throw new Error('VITE_PRICE_API_URL is not defined in .env');
    }
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  },
});

const prompt = ai.definePrompt({
  name: 'fetchLivePricesPrompt',
  tools: [getLivePrices],
  prompt: `You are a service that fetches live prices for cryptocurrencies in USD.

  Call the getLivePrices tool to get the current prices for POL/MATIC (polygon-ecosystem-token) and USDT (usd-coin).

  Return the prices in the following JSON format:
  {
    "maticUsd": <POL/MATIC price in USD>,
    "usdtUsd": <USDT price in USD>
  }`,
  output: {schema: FetchLivePricesOutputSchema},
});

const fetchLivePricesFlow = ai.defineFlow({
  name: 'fetchLivePricesFlow',
  inputSchema: z.void(),
  outputSchema: FetchLivePricesOutputSchema,
}, async () => {
  const {output} = await prompt({});
  return output!;
});
