"use client";
import type { Recipe } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Trash2, Utensils } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (recipeId: string) => void;
}

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">{recipe.name}</CardTitle>
        {recipe.description && <CardDescription className="text-sm">{recipe.description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-3">
          <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
            <Utensils className="w-4 h-4 text-muted-foreground" /> Ingredients:
          </h4>
          {recipe.ingredients.length > 0 ? (
            <ul className="list-disc list-inside text-sm space-y-0.5 max-h-24 overflow-y-auto">
              {recipe.ingredients.slice(0, 5).map((ing, index) => (
                <li key={ing.id || index} className="text-muted-foreground">
                  {ing.name} - {ing.quantity} {ing.unit}
                  {index === 4 && recipe.ingredients.length > 5 && "..."}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No ingredients listed.</p>
          )}
        </div>
        {recipe.servingsPerRecipe && (
          <Badge variant="secondary">Serves: {recipe.servingsPerRecipe}</Badge>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Link href={`/recipes/${recipe.id}/edit`} passHref>
          <Button variant="outline" size="sm">
            <Edit3 className="mr-2 h-4 w-4" /> Edit
          </Button>
        </Link>
        <Button variant="destructive" size="sm" onClick={() => onDelete(recipe.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
