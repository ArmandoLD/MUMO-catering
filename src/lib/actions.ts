"use server";

import { suggestRecipeAdjustments } from "@/ai/flows/suggest-recipe-adjustments";
import type { SuggestRecipeAdjustmentsInput, SuggestRecipeAdjustmentsOutput } from "@/ai/flows/suggest-recipe-adjustments";
import type { AISuggestion, AdjustedIngredient } from "./types";

export async function getWasteReductionSuggestions(
  recipeName: string,
  historicalWasteDataString: string
): Promise<{ data?: AISuggestion; error?: string }> {
  try {
    const input: SuggestRecipeAdjustmentsInput = {
      recipeName,
      historicalWasteData: historicalWasteDataString,
    };

    const result: SuggestRecipeAdjustmentsOutput = await suggestRecipeAdjustments(input);
    
    let parsedAdjustedIngredients: AdjustedIngredient[] = [];
    try {
      parsedAdjustedIngredients = JSON.parse(result.adjustedIngredients);
    } catch (parseError) {
      console.warn("La IA devolvió ingredientesAjustados que no son JSON, usando como cadena de texto:", result.adjustedIngredients);
      parsedAdjustedIngredients = [{ ingredientName: "Sugerencia de IA", newRecommendedQuantity: result.adjustedIngredients }];
    }


    const suggestion: AISuggestion = {
      adjustedIngredients: parsedAdjustedIngredients,
      reasoning: result.reasoning,
    };
    
    return { data: suggestion };

  } catch (error) {
    console.error("Error al llamar a la IA para sugerencias de reducción de desperdicios:", error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "Ocurrió un error desconocido al obtener sugerencias de la IA." };
  }
}
