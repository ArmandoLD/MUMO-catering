"use client";
import type { Banquet, Recipe, Ingredient } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator } from "lucide-react";

interface IngredientCalculatorProps {
  banquet: Banquet;
  recipes: Recipe[]; // All available recipes to look up from menu
}

interface CalculatedIngredient {
  name: string;
  totalQuantity: number;
  unit: string;
}

export function IngredientCalculator({ banquet, recipes }: IngredientCalculatorProps) {
  const calculateTotalIngredients = (): CalculatedIngredient[] => {
    const aggregatedIngredients: Record<string, { totalQuantity: number; unit: string }> = {};

    banquet.menu.forEach(menuItem => {
      const recipe = recipes.find(r => r.id === menuItem.recipeId);
      if (!recipe || !recipe.servingsPerRecipe || recipe.servingsPerRecipe === 0) return;

      const scaleFactor = banquet.guestCount / recipe.servingsPerRecipe;

      recipe.ingredients.forEach(ingredient => {
        const key = `${ingredient.name.toLowerCase()}_${ingredient.unit.toLowerCase()}`;
        const scaledQuantity = ingredient.quantity * scaleFactor;

        if (aggregatedIngredients[key]) {
          aggregatedIngredients[key].totalQuantity += scaledQuantity;
        } else {
          aggregatedIngredients[key] = {
            totalQuantity: scaledQuantity,
            unit: ingredient.unit,
          };
        }
      });
    });

    return Object.entries(aggregatedIngredients).map(([nameKey, data]) => {
      // Extract original name casing if possible, or use the key
      const originalIngredient = banquet.menu
        .flatMap(mi => recipes.find(r => r.id === mi.recipeId)?.ingredients || [])
        .find(ing => `${ing.name.toLowerCase()}_${ing.unit.toLowerCase()}` === nameKey);
      
      return {
        name: originalIngredient?.name || nameKey.split('_')[0],
        totalQuantity: parseFloat(data.totalQuantity.toFixed(2)), // Round to 2 decimal places
        unit: data.unit,
      };
    }).sort((a,b) => a.name.localeCompare(b.name));
  };

  const totalIngredients = calculateTotalIngredients();

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calculator className="w-5 h-5 text-primary" />
          Calculated Ingredients for {banquet.guestCount} Guests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalIngredients.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead className="text-right">Total Quantity</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totalIngredients.map((ing, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{ing.name}</TableCell>
                  <TableCell className="text-right">{ing.totalQuantity}</TableCell>
                  <TableCell>{ing.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">No ingredients to calculate. Check if recipes have servings defined or menu is empty.</p>
        )}
      </CardContent>
    </Card>
  );
}
