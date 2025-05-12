import type { Recipe, Banquet, Ingredient, WasteEntry } from './types'; // Added WasteEntry for full context

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const initialRecipes: Recipe[] = [
  {
    id: generateId(),
    name: 'Sopa de Tomate',
    description: 'Sopa de tomate clásica y cremosa.',
    ingredients: [
      { id: generateId(), name: 'Tomates', quantity: 1, unit: 'kg' },
      { id: generateId(), name: 'Cebolla', quantity: 1, unit: 'unidad' },
      { id: generateId(), name: 'Ajo', quantity: 2, unit: 'dientes' },
      { id: generateId(), name: 'Caldo de Verduras', quantity: 500, unit: 'ml' },
      { id: generateId(), name: 'Nata', quantity: 100, unit: 'ml' },
    ],
    instructions: 'Sofreír cebolla y ajo. Añadir tomates y caldo. Cocinar a fuego lento. Triturar. Incorporar la nata.',
    servingsPerRecipe: 4,
  },
  {
    id: generateId(),
    name: 'Pasta Alfredo con Pollo',
    description: 'Pasta alfredo rica y cremosa con pollo.',
    ingredients: [
      { id: generateId(), name: 'Pechuga de Pollo', quantity: 2, unit: 'unidades' },
      { id: generateId(), name: 'Pasta Fettuccine', quantity: 250, unit: 'g' },
      { id: generateId(), name: 'Nata para cocinar', quantity: 200, unit: 'ml' },
      { id: generateId(), name: 'Queso Parmesano', quantity: 50, unit: 'g' },
      { id: generateId(), name: 'Mantequilla', quantity: 30, unit: 'g' },
      { id: generateId(), name: 'Ajo', quantity: 2, unit: 'dientes' },
    ],
    instructions: 'Cocinar la pasta. Cocinar el pollo. Hacer salsa alfredo con nata, mantequilla, ajo y parmesano. Combinar todo.',
    servingsPerRecipe: 3,
  },
  {
    id: generateId(),
    name: 'Ensalada César',
    description: 'Lechuga romana crujiente con aderezo César y picatostes.',
    ingredients: [
      { id: generateId(), name: 'Lechuga Romana', quantity: 1, unit: 'unidad' },
      { id: generateId(), name: 'Picatostes', quantity: 1, unit: 'taza' },
      { id: generateId(), name: 'Queso Parmesano', quantity: 30, unit: 'g' },
      { id: generateId(), name: 'Aderezo César', quantity: 100, unit: 'ml' },
    ],
    instructions: 'Cortar la lechuga. Mezclar con el aderezo, parmesano y picatostes.',
    servingsPerRecipe: 4,
  },
];

export const initialBanquets: Banquet[] = [
  {
    id: generateId(),
    name: 'Cena de Gala de Verano',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // One week from now
    guestCount: 50,
    menu: [
      { recipeId: initialRecipes[0]?.id || '' }, // Sopa de Tomate
      { recipeId: initialRecipes[1]?.id || '' }, // Pasta Alfredo con Pollo
    ],
  },
  {
    id: generateId(),
    name: 'Almuerzo Corporativo',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Two weeks from now
    guestCount: 20,
    menu: [
      { recipeId: initialRecipes[2]?.id || '' }, // Ensalada César
      { recipeId: initialRecipes[0]?.id || '' }, // Sopa de Tomate
    ],
  },
];

export const initialWasteEntries: WasteEntry[] = [
    {
        id: generateId(),
        banquetId: initialBanquets[0]?.id || '',
        recipeId: initialRecipes[0]?.id || '',
        ingredientName: 'Tomates',
        wastedQuantity: 0.5,
        unit: 'kg',
        reason: 'Porciones excesivas',
        dateRecorded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
        id: generateId(),
        banquetId: initialBanquets[0]?.id || '',
        recipeId: initialRecipes[0]?.id || '',
        ingredientName: 'Nata',
        wastedQuantity: 20,
        unit: 'ml',
        reason: 'Próximo a caducar',
        dateRecorded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    }
]

export function getRecipeNameById(recipeId: string, recipes: Recipe[]): string {
  return recipes.find(r => r.id === recipeId)?.name || 'Receta Desconocida';
}
