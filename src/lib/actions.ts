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
    
    // Parse the adjustedIngredients string if it's JSON
    let parsedAdjustedIngredients: AdjustedIngredient[] = [];
    try {
      parsedAdjustedIngredients = JSON.parse(result.adjustedIngredients);
    } catch (parseError) {
      console.warn("AI returned non-JSON adjustedIngredients, using as string:", result.adjustedIngredients);
      // Fallback: if it's not JSON, maybe it's a plain string description. Wrap it.
      // Or handle based on expected AI behavior. For now, let's assume it aims for JSON.
      // If it's critical it's JSON, throw error or refine prompt.
      // For now, we'll pass it as potentially unparsed. The UI might need to handle this.
      // This mapping helps ensure the type structure even if parsing fails.
      parsedAdjustedIngredients = [{ ingredientName: "AI Suggestion", newRecommendedQuantity: result.adjustedIngredients }];
    }


    const suggestion: AISuggestion = {
      adjustedIngredients: parsedAdjustedIngredients,
      reasoning: result.reasoning,
    };
    
    return { data: suggestion };

  } catch (error) {
    console.error("Error calling AI for waste reduction suggestions:", error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unknown error occurred while fetching AI suggestions." };
  }
}
