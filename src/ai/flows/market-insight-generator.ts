'use server';

/**
 * @fileOverview Market insight generator for car traders and market analysts.
 *
 * - generateMarketInsights - A function that generates market insights based on user filters.
 * - MarketInsightInput - The input type for the generateMarketInsights function.
 * - MarketInsightOutput - The return type for the generateMarketInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketInsightInputSchema = z.object({
  carBrand: z.string().describe('The brand of the car.'),
  carModel: z.string().describe('The model of the car.'),
  carTrim: z.string().describe('The trim of the car.'),
  location: z.string().describe('The location to filter by (governorate and area).'),
});

export type MarketInsightInput = z.infer<typeof MarketInsightInputSchema>;

const MarketInsightOutputSchema = z.object({
  activeListings: z.number().describe('The number of active listings for the specified car type.'),
  highDemandAreas: z.string().describe('Areas with high demand for the specified car type.'),
  averageSellingTime: z.string().describe('The average selling time for the specified car type.'),
  supplyDemandRatio: z.string().describe('The ratio of supply to demand for the specified car type.'),
  expectedMarketPrice: z.string().describe('The expected market price for the specified car type with confidence indicators.'),
});

export type MarketInsightOutput = z.infer<typeof MarketInsightOutputSchema>;

export async function generateMarketInsights(input: MarketInsightInput): Promise<MarketInsightOutput> {
  return marketInsightGeneratorFlow(input);
}

const marketInsightPrompt = ai.definePrompt({
  name: 'marketInsightPrompt',
  input: {schema: MarketInsightInputSchema},
  output: {schema: MarketInsightOutputSchema},
  prompt: `You are an expert market analyst specializing in the Iraqi car market. Provide insights based on the following filters:

Car Brand: {{{carBrand}}}
Car Model: {{{carModel}}}
Car Trim: {{{carTrim}}}
Location: {{{location}}}

Analyze the market and provide the following information:

*   Number of active listings for this car type (activeListings).
*   Areas with high demand for this car type (highDemandAreas).
*   Average selling time for this car type (averageSellingTime).
*   Ratio of supply to demand for this car type (supplyDemandRatio).
*   Expected market price for this car type, including confidence indicators (expectedMarketPrice).

Present the information in a clear and concise manner, suitable for car traders and market analysts.`,
});

const marketInsightGeneratorFlow = ai.defineFlow(
  {
    name: 'marketInsightGeneratorFlow',
    inputSchema: MarketInsightInputSchema,
    outputSchema: MarketInsightOutputSchema,
  },
  async input => {
    const {output} = await marketInsightPrompt(input);
    return output!;
  }
);
