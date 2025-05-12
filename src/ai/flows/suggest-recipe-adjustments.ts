'use server';

/**
 * @fileOverview Analyzes historical food waste data and suggests adjustments to ingredient quantities in recipes.
 *
 * - suggestRecipeAdjustments - A function that suggests recipe adjustments based on waste data.
 * - SuggestRecipeAdjustmentsInput - The input type for the suggestRecipeAdjustments function.
 * - SuggestRecipeAdjustmentsOutput - The return type for the suggestRecipeAdjustments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipeAdjustmentsInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to adjust.'),
  historicalWasteData: z
    .string()
    .describe(
      'Historical data of food waste for the recipe, including ingredient, wasted quantity, and number of servings. The data should be formatted as a JSON string.'
    ),
});
export type SuggestRecipeAdjustmentsInput = z.infer<typeof SuggestRecipeAdjustmentsInputSchema>;

const SuggestRecipeAdjustmentsOutputSchema = z.object({
  adjustedIngredients: z
    .string()
    .describe(
      'Suggested adjustments to ingredient quantities in the recipe, including the ingredient name and the new recommended quantity. The data should be formatted as a JSON string.'
    ),
  reasoning: z
    .string()
    .describe('Explanation for the suggested adjustments, based on historical waste data.'),
});

export type SuggestRecipeAdjustmentsOutput = z.infer<typeof SuggestRecipeAdjustmentsOutputSchema>;

export async function suggestRecipeAdjustments(
  input: SuggestRecipeAdjustmentsInput
): Promise<SuggestRecipeAdjustmentsOutput> {
  return suggestRecipeAdjustmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipeAdjustmentsPrompt',
  input: {schema: SuggestRecipeAdjustmentsInputSchema},
  output: {schema: SuggestRecipeAdjustmentsOutputSchema},
  prompt: `You are an expert culinary advisor specializing in reducing food waste in catering services. Analyze the historical waste data for the recipe provided and suggest adjustments to ingredient quantities to minimize waste. Consider factors such as ingredient waste frequency and quantity relative to the number of servings. Provide a clear explanation for each adjustment. The adjustedIngredients should be in JSON format.

Recipe Name: {{{recipeName}}}
Historical Waste Data: {{{historicalWasteData}}}

Output the adjusted ingredients and the reasoning behind these adjustments.`, // Modified prompt
});

const suggestRecipeAdjustmentsFlow = ai.defineFlow(
  {
    name: 'suggestRecipeAdjustmentsFlow',
    inputSchema: SuggestRecipeAdjustmentsInputSchema,
    outputSchema: SuggestRecipeAdjustmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
