"use client";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { useAppContext } from "@/context/AppContext";
import type { RecipeFormData } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Recipe } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditRecipePage() {
  const { getRecipeById, updateRecipe } = useAppContext();
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id as string;
  
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (recipeId) {
      const fetchedRecipe = getRecipeById(recipeId);
      if (fetchedRecipe) {
        setRecipe(fetchedRecipe);
      } else {
        // Handle recipe not found, perhaps redirect or show error
        router.push('/recipes'); // Or a 404 page
      }
      setLoading(false);
    }
  }, [recipeId, getRecipeById, router]);

  const handleSubmit = (data: RecipeFormData) => {
    if (recipeId) {
      updateRecipe(recipeId, data);
      router.push("/recipes");
    }
  };

  if (loading) {
    return (
        <div className="container mx-auto py-8">
            <Skeleton className="h-[600px] w-full max-w-2xl mx-auto" />
        </div>
    )
  }

  if (!recipe) {
    return <div className="container mx-auto py-8 text-center">Recipe not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <RecipeForm initialData={recipe} onSubmit={handleSubmit} isEditing />
    </div>
  );
}
