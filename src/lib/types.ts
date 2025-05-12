export interface Ingredient {
  id: string; // Unique within a recipe
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string; // Globally unique
  name: string;
  description?: string;
  ingredients: Ingredient[];
  instructions?: string;
  servingsPerRecipe?: number; // Typical number of servings this recipe yields
}

export interface MenuItem {
  recipeId: string;
  // quantity: number; // e.g., if making multiple batches of the same recipe for a banquet
  // For simplicity, assume one "batch" of the recipe is selected. Guest count scaling handles overall quantity.
}

export interface WasteEntry {
  id: string; // Globally unique
  banquetId: string;
  recipeId: string; // The recipe within the banquet this waste is associated with
  ingredientName: string;
  wastedQuantity: number;
  unit: string;
  reason?: string;
  dateRecorded: string; // ISO Date string
}

export interface Banquet {
  id: string; // Globally unique
  name: string;
  date: string; // ISO Date string
  guestCount: number;
  menu: MenuItem[]; // List of recipe IDs selected for the banquet
  // Waste entries will be associated via banquetId but not directly embedded for scalability
}

// For AI input, based on SuggestRecipeAdjustmentsInput
export interface HistoricalWasteDataItem {
  ingredient: string;
  wastedQuantity: number;
  unit: string;
  numberOfServings: number; // Number of servings for the context of this waste
  // recipeName could be added if the AI needs it explicitly, but recipeId is more robust
}

// For AI output, matching SuggestRecipeAdjustmentsOutput
export interface AdjustedIngredient {
  ingredientName: string;
  newRecommendedQuantity: string; // e.g. "1.5 kg", "200 g", as per AI output structure
}

export interface AISuggestion {
  adjustedIngredients: AdjustedIngredient[];
  reasoning: string;
}

// Helper type for forms
export type RecipeFormData = Omit<Recipe, 'id'> & {
  servingsPerRecipeStr?: string; // For form input before parsing
};
export type BanquetFormData = Omit<Banquet, 'id'> & {
  guestCountStr?: string; // For form input
};

export type WasteEntryFormData = Omit<WasteEntry, 'id' | 'banquetId' | 'dateRecorded'> & {
  wastedQuantityStr?: string;
};
