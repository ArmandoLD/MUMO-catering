"use client";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { useAppContext } from "@/context/AppContext";
import type { RecipeFormData } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const { addRecipe } = useAppContext();
  const router = useRouter();

  const handleSubmit = (data: RecipeFormData) => {
    addRecipe(data);
    router.push("/recipes");
  };

  return (
    <div className="container mx-auto py-8">
      <RecipeForm onSubmit={handleSubmit} />
    </div>
  );
}
