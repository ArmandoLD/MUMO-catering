'use server';

/**
 * @fileOverview Analiza datos históricos de desperdicio de alimentos y sugiere ajustes en las cantidades de ingredientes en recetas.
 *
 * - suggestRecipeAdjustments - Una función que sugiere ajustes de recetas basados en datos de desperdicio.
 * - SuggestRecipeAdjustmentsInput - El tipo de entrada para la función suggestRecipeAdjustments.
 * - SuggestRecipeAdjustmentsOutput - El tipo de retorno para la función suggestRecipeAdjustments.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipeAdjustmentsInputSchema = z.object({
  recipeName: z.string().describe('El nombre de la receta a ajustar.'),
  historicalWasteData: z
    .string()
    .describe(
      'Datos históricos de desperdicio de alimentos para la receta, incluyendo ingrediente, cantidad desperdiciada y número de porciones. Los datos deben estar formateados como una cadena JSON.'
    ),
});
export type SuggestRecipeAdjustmentsInput = z.infer<typeof SuggestRecipeAdjustmentsInputSchema>;

const SuggestRecipeAdjustmentsOutputSchema = z.object({
  adjustedIngredients: z
    .string()
    .describe(
      'Ajustes sugeridos a las cantidades de ingredientes en la receta, incluyendo el nombre del ingrediente y la nueva cantidad recomendada. Los datos deben estar formateados como una cadena JSON.'
    ),
  reasoning: z
    .string()
    .describe('Explicación de los ajustes sugeridos, basada en los datos históricos de desperdicio.'),
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
  prompt: `Eres un asesor culinario experto especializado en reducir el desperdicio de alimentos en servicios de catering. Analiza los datos históricos de desperdicio para la receta proporcionada y sugiere ajustes en las cantidades de los ingredientes para minimizar el desperdicio. Considera factores como la frecuencia y cantidad de desperdicio de ingredientes en relación con el número de porciones. Proporciona una explicación clara para cada ajuste. Los adjustedIngredients deben estar en formato JSON.

Nombre de la Receta: {{{recipeName}}}
Datos Históricos de Desperdicio: {{{historicalWasteData}}}

Devuelve los ingredientes ajustados y la justificación detrás de estos ajustes.`,
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
