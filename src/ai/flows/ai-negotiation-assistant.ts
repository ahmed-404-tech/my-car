'use server';

/**
 * @fileOverview An AI negotiation assistant to help users negotiate the price of a car when buying or selling.
 *
 * - negotiatePrice - A function that handles the price negotiation process.
 * - NegotiatePriceInput - The input type for the negotiatePrice function.
 * - NegotiatePriceOutput - The return type for the negotiatePrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NegotiatePriceInputSchema = z.object({
  carSpecifications: z.string().describe('Detailed specifications of the car, including make, model, year, and condition.'),
  userRole: z.enum(['buyer', 'seller']).describe('The role of the user in the negotiation (buyer or seller).'),
  initialPrice: z.number().describe('The initial price set by the seller or offered by the buyer.'),
  targetPrice: z.number().describe('The target price the user is hoping to achieve.'),
  minimumAcceptablePrice: z.number().optional().describe('The minimum acceptable price for the seller, if applicable.'),
  buyerBudget: z.number().optional().describe('The buyer budget if applicable'),
  negotiationHistory: z.array(z.object({
    role: z.enum(['buyer', 'seller', 'ai']).describe('The role of the speaker in this turn.'),
    message: z.string().describe('The message spoken in this turn')
  })).optional().describe('The history of messages that have been sent in this negotiation so far.')
});
export type NegotiatePriceInput = z.infer<typeof NegotiatePriceInputSchema>;

const NegotiatePriceOutputSchema = z.object({
  suggestedMessage: z.string().describe('The AI-generated message to suggest to the user for the next negotiation turn.'),
  newPrice: z.number().optional().describe('The AI suggested new price based on the negotiation.')
});
export type NegotiatePriceOutput = z.infer<typeof NegotiatePriceOutputSchema>;

export async function negotiatePrice(input: NegotiatePriceInput): Promise<NegotiatePriceOutput> {
  return negotiatePriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'negotiatePricePrompt',
  input: {schema: NegotiatePriceInputSchema},
  output: {schema: NegotiatePriceOutputSchema},
  prompt: `You are an AI negotiation assistant helping a {{{userRole}}} to negotiate the price of a car.

Car Specifications: {{{carSpecifications}}}
Initial Price: {{{initialPrice}}}
Target Price: {{{targetPrice}}}
Minimum Acceptable Price (if seller): {{{minimumAcceptablePrice}}}
Buyer Budget (if buyer): {{{buyerBudget}}}

Existing Negotiation History:
{{#each negotiationHistory}}
  {{this.role}}: {{this.message}}
{{/each}}

Based on the above information, suggest a message for the {{{userRole}}} to send to the other party, to continue negotiations and get closer to the target price, and suggest a new price for the car.

Consider the negotiation history, car specifications, and the user's role to craft a persuasive and reasonable message. Take into account the budget of the buyer, or the minimum acceptable price of a seller. If the negotiation has stalled, consider making a more agressive offer or suggesting a compromise.

Output:
Suggest Message: {{suggestedMessage}}
New Price: {{newPrice}}
`,
});

const negotiatePriceFlow = ai.defineFlow(
  {
    name: 'negotiatePriceFlow',
    inputSchema: NegotiatePriceInputSchema,
    outputSchema: NegotiatePriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
