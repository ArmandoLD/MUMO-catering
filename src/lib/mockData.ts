import type { Recipe, Banquet, Ingredient } from './types';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const initialRecipes: Recipe[] = [
  {
    id: generateId(),
    name: 'Tomato Soup',
    description: 'Classic creamy tomato soup.',
    ingredients: [
      { id: generateId(), name: 'Tomatoes', quantity: 1, unit: 'kg' },
      { id: generateId(), name: 'Onion', quantity: 1, unit: 'piece' },
      { id: generateId(), name: 'Garlic', quantity: 2, unit: 'cloves' },
      { id: generateId(), name: 'Vegetable Broth', quantity: 500, unit: 'ml' },
      { id: generateId(), name: 'Cream', quantity: 100, unit: 'ml' },
    ],
    instructions: 'Sauté onion and garlic. Add tomatoes and broth. Simmer. Blend. Stir in cream.',
    servingsPerRecipe: 4,
  },
  {
    id: generateId(),
    name: 'Chicken Alfredo Pasta',
    description: 'Rich and creamy chicken alfredo.',
    ingredients: [
      { id: generateId(), name: 'Chicken Breast', quantity: 2, unit: 'pieces' },
      { id: generateId(), name: 'Fettuccine Pasta', quantity: 250, unit: 'g' },
      { id: generateId(), name: 'Heavy Cream', quantity: 200, unit: 'ml' },
      { id: generateId(), name: 'Parmesan Cheese', quantity: 50, unit: 'g' },
      { id: generateId(), name: 'Butter', quantity: 30, unit: 'g' },
      { id: generateId(), name: 'Garlic', quantity: 2, unit: 'cloves' },
    ],
    instructions: 'Cook pasta. Cook chicken. Make alfredo sauce with cream, butter, garlic, parmesan. Combine all.',
    servingsPerRecipe: 3,
  },
  {
    id: generateId(),
    name: 'Caesar Salad',
    description: 'Crisp romaine with Caesar dressing and croutons.',
    ingredients: [
      { id: generateId(), name: 'Romaine Lettuce', quantity: 1, unit: 'head' },
      { id: generateId(), name: 'Croutons', quantity: 1, unit: 'cup' },
      { id: generateId(), name: 'Parmesan Cheese', quantity: 30, unit: 'g' },
      { id: generateId(), name: 'Caesar Dressing', quantity: 100, unit: 'ml' },
    ],
    instructions: 'Chop lettuce. Toss with dressing, parmesan, and croutons.',
    servingsPerRecipe: 4,
  },
];

export const initialBanquets: Banquet[] = [
  {
    id: generateId(),
    name: 'Summer Gala Dinner',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // One week from now
    guestCount: 50,
    menu: [
      { recipeId: initialRecipes[0]?.id || '' }, // Tomato Soup
      { recipeId: initialRecipes[1]?.id || '' }, // Chicken Alfredo
    ],
  },
  {
    id: generateId(),
    name: 'Corporate Lunch',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Two weeks from now
    guestCount: 20,
    menu: [
      { recipeId: initialRecipes[2]?.id || '' }, // Caesar Salad
      { recipeId: initialRecipes[0]?.id || '' }, // Tomato Soup
    ],
  },
];

export const initialWasteEntries: WasteEntry[] = [
    {
        id: generateId(),
        banquetId: initialBanquets[0]?.id || '',
        recipeId: initialRecipes[0]?.id || '',
        ingredientName: 'Tomatoes',
        wastedQuantity: 0.5,
        unit: 'kg',
        reason: 'Over-portioned',
        dateRecorded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
        id: generateId(),
        banquetId: initialBanquets[0]?.id || '',
        recipeId: initialRecipes[0]?.id || '',
        ingredientName: 'Cream',
        wastedQuantity: 20,
        unit: 'ml',
        reason: 'Expired soon',
        dateRecorded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    }
]

export function getRecipeNameById(recipeId: string, recipes: Recipe[]): string {
  return recipes.find(r => r.id === recipeId)?.name || 'Unknown Recipe';
}
