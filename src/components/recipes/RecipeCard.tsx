"use client";
import type { Recipe } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Trash2, Utensils, Eye } from "lucide-react"; // Added Eye for consistency if needed, though not used here
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (recipeId: string) => void;
}

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300 min-h-[360px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">{recipe.name}</CardTitle>
        {recipe.description && <CardDescription className="text-sm min-h-[40px]">{recipe.description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-3">
          <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
            <Utensils className="w-4 h-4 text-muted-foreground" /> Ingredientes:
          </h4>
          {recipe.ingredients.length > 0 ? (
            <ul className="list-disc list-inside text-sm space-y-0.5 max-h-32 overflow-y-auto"> {/* Increased max-h */}
              {recipe.ingredients.slice(0, 6).map((ing, index) => ( // Show up to 6 ingredients
                <li key={ing.id || index} className="text-muted-foreground">
                  {ing.name} - {ing.quantity} {ing.unit}
                  {index === 5 && recipe.ingredients.length > 6 && "..."}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No hay ingredientes listados.</p>
          )}
        </div>
        {recipe.servingsPerRecipe && (
          <Badge variant="secondary">Rinde: {recipe.servingsPerRecipe} porciones</Badge>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
        <Link href={`/recipes/${recipe.id}/edit`} passHref>
          <Button variant="outline" size="icon" aria-label="Editar receta">
            <Edit3 className="h-4 w-4" />
          </Button>
        </Link>
        <Button variant="destructive" size="icon" onClick={() => onDelete(recipe.id)} aria-label="Eliminar receta">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
