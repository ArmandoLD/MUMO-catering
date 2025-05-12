"use client";
import { RecipeList } from "@/components/recipes/RecipeList";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { PlusCircle, ChefHat } from "lucide-react";
import Link from "next/link";

export default function RecipesPage() {
  const { recipes, deleteRecipe } = useAppContext();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
           <ChefHat className="w-10 h-10 text-primary" /> Your Recipes
        </h1>
        <Link href="/recipes/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Recipe
          </Button>
        </Link>
      </div>
      <RecipeList recipes={recipes} onDeleteRecipe={deleteRecipe} />
    </div>
  );
}
