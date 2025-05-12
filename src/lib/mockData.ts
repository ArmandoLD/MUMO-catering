import type { Recipe, Banquet, Ingredient, WasteEntry } from './types';

// Using a fixed reference date for consistent mock data dates
const REFERENCE_DATE = new Date(2024, 6, 15); // July 15, 2024

export const initialRecipes: Recipe[] = [
  {
    id: 'recipe-sopa-tomate-01',
    name: 'Sopa de Tomate',
    description: 'Sopa de tomate clásica y cremosa.',
    ingredients: [
      { id: 'ing-tomates-sopa-01a', name: 'Tomates', quantity: 1, unit: 'kg' },
      { id: 'ing-cebolla-sopa-01b', name: 'Cebolla', quantity: 1, unit: 'unidad' },
      { id: 'ing-ajo-sopa-01c', name: 'Ajo', quantity: 2, unit: 'dientes' },
      { id: 'ing-caldo-sopa-01d', name: 'Caldo de Verduras', quantity: 500, unit: 'ml' },
      { id: 'ing-nata-sopa-01e', name: 'Nata', quantity: 100, unit: 'ml' },
    ],
    instructions: 'Sofreír cebolla y ajo. Añadir tomates y caldo. Cocinar a fuego lento. Triturar. Incorporar la nata.',
    servingsPerRecipe: 4,
  },
  {
    id: 'recipe-pasta-alfredo-02',
    name: 'Pasta Alfredo con Pollo',
    description: 'Pasta alfredo rica y cremosa con pollo.',
    ingredients: [
      { id: 'ing-pollo-pasta-02a', name: 'Pechuga de Pollo', quantity: 2, unit: 'unidades' },
      { id: 'ing-fettuccine-pasta-02b', name: 'Pasta Fettuccine', quantity: 250, unit: 'g' },
      { id: 'ing-nata-pasta-02c', name: 'Nata para cocinar', quantity: 200, unit: 'ml' },
      { id: 'ing-parmesano-pasta-02d', name: 'Queso Parmesano', quantity: 50, unit: 'g' },
      { id: 'ing-mantequilla-pasta-02e', name: 'Mantequilla', quantity: 30, unit: 'g' },
      { id: 'ing-ajo-pasta-02f', name: 'Ajo', quantity: 2, unit: 'dientes' },
    ],
    instructions: 'Cocinar la pasta. Cocinar el pollo. Hacer salsa alfredo con nata, mantequilla, ajo y parmesano. Combinar todo.',
    servingsPerRecipe: 3,
  },
  {
    id: 'recipe-ensalada-cesar-03',
    name: 'Ensalada César',
    description: 'Lechuga romana crujiente con aderezo César y picatostes.',
    ingredients: [
      { id: 'ing-lechuga-cesar-03a', name: 'Lechuga Romana', quantity: 1, unit: 'unidad' },
      { id: 'ing-picatostes-cesar-03b', name: 'Picatostes', quantity: 1, unit: 'taza' },
      { id: 'ing-parmesano-cesar-03c', name: 'Queso Parmesano', quantity: 30, unit: 'g' },
      { id: 'ing-aderezo-cesar-03d', name: 'Aderezo César', quantity: 100, unit: 'ml' },
    ],
    instructions: 'Cortar la lechuga. Mezclar con el aderezo, parmesano y picatostes.',
    servingsPerRecipe: 4,
  },
];

export const initialBanquets: Banquet[] = [
  {
    id: 'banquet-gala-verano-01',
    name: 'Cena de Gala de Verano',
    date: new Date(REFERENCE_DATE.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // One week from reference
    guestCount: 50,
    menu: [
      { recipeId: initialRecipes[0]?.id || 'recipe-sopa-tomate-01' },
      { recipeId: initialRecipes[1]?.id || 'recipe-pasta-alfredo-02' },
    ],
  },
  {
    id: 'banquet-almuerzo-corp-02',
    name: 'Almuerzo Corporativo',
    date: new Date(REFERENCE_DATE.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Two weeks from reference
    guestCount: 20,
    menu: [
      { recipeId: initialRecipes[2]?.id || 'recipe-ensalada-cesar-03' },
      { recipeId: initialRecipes[0]?.id || 'recipe-sopa-tomate-01' },
    ],
  },
];

export const initialWasteEntries: WasteEntry[] = [
    {
        id: 'waste-tomates-gala-01a',
        banquetId: initialBanquets[0]?.id || 'banquet-gala-verano-01',
        recipeId: initialRecipes[0]?.id || 'recipe-sopa-tomate-01',
        ingredientName: 'Tomates',
        wastedQuantity: 0.5,
        unit: 'kg',
        reason: 'Porciones excesivas',
        dateRecorded: new Date(REFERENCE_DATE.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days before reference
    },
    {
        id: 'waste-nata-gala-01b',
        banquetId: initialBanquets[0]?.id || 'banquet-gala-verano-01',
        recipeId: initialRecipes[0]?.id || 'recipe-sopa-tomate-01',
        ingredientName: 'Nata',
        wastedQuantity: 20,
        unit: 'ml',
        reason: 'Próximo a caducar',
        dateRecorded: new Date(REFERENCE_DATE.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days before reference
    }
];

// This function is still used by AppContext for new items, but not for initial mock data.
// It's moved to AppContext or similar if it's only needed there.
// For this file, we ensure all initial data uses static IDs.

export function getRecipeNameById(recipeId: string, recipes: Recipe[]): string {
  return recipes.find(r => r.id === recipeId)?.name || 'Receta Desconocida';
}
