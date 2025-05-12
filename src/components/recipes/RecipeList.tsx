"use client";
import type { Recipe } from "@/lib/types";
import { RecipeCard } from "./RecipeCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, ChefHat } from "lucide-react";

interface RecipeListProps {
  recipes: Recipe[];
  onDeleteRecipe: (recipeId: string) => void;
}

export function RecipeList({ recipes, onDeleteRecipe }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-10">
        <ChefHat className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Aún No Hay Recetas</h2>
        <p className="text-muted-foreground mb-4">¡Comienza añadiendo tu primera creación culinaria!</p>
        <Link href="/recipes/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nueva Receta
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onDelete={onDeleteRecipe} />
      ))}
    </div>
  );
}
