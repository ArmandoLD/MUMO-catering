// src/context/AppContext.tsx
"use client";
import type { Recipe, Banquet, WasteEntry, Ingredient, RecipeFormData, BanquetFormData, WasteEntryFormData } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { initialRecipes as defaultRecipes, initialBanquets as defaultBanquets, initialWasteEntries as defaultWasteEntries } from '@/lib/mockData';
import { useToast } from "@/hooks/use-toast";

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

interface AppContextType {
  recipes: Recipe[];
  addRecipe: (recipeData: RecipeFormData) => void;
  updateRecipe: (recipeId: string, recipeData: RecipeFormData) => void;
  deleteRecipe: (recipeId: string) => void;
  getRecipeById: (recipeId: string) => Recipe | undefined;

  banquets: Banquet[];
  addBanquet: (banquetData: BanquetFormData) => void;
  updateBanquet: (banquetId: string, banquetData: BanquetFormData) => void;
  deleteBanquet: (banquetId: string) => void;
  getBanquetById: (banquetId: string) => Banquet | undefined;

  wasteEntries: WasteEntry[];
  addWasteEntry: (banquetId: string, wasteData: WasteEntryFormData) => void;
  getWasteEntriesByBanquet: (banquetId: string) => WasteEntry[];
  getWasteEntriesByRecipeForAI: (recipeName: string) => { ingredient: string; wastedQuantity: number; unit: string; numberOfServings: number }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(defaultRecipes);
  const [banquets, setBanquets] = useState<Banquet[]>(defaultBanquets);
  const [wasteEntries, setWasteEntries] = useState<WasteEntry[]>(defaultWasteEntries);
  const { toast } = useToast();

  const getRecipeById = useCallback((recipeId: string) => recipes.find(r => r.id === recipeId), [recipes]);
  const getBanquetById = useCallback((banquetId: string) => banquets.find(b => b.id === banquetId), [banquets]);

  const addRecipe = (recipeData: RecipeFormData) => {
    const newIngredients: Ingredient[] = recipeData.ingredients.map(ing => ({ ...ing, id: generateId() }));
    const newRecipe: Recipe = { 
      ...recipeData, 
      id: generateId(), 
      ingredients: newIngredients,
      servingsPerRecipe: recipeData.servingsPerRecipeStr ? parseInt(recipeData.servingsPerRecipeStr) : undefined,
    };
    setRecipes(prev => [...prev, newRecipe]);
    toast({ title: "Recipe Added", description: `${newRecipe.name} has been successfully added.` });
  };

  const updateRecipe = (recipeId: string, recipeData: RecipeFormData) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { 
      ...r, 
      ...recipeData, 
      ingredients: recipeData.ingredients.map(ing => ({ ...ing, id: ing.id || generateId() })),
      servingsPerRecipe: recipeData.servingsPerRecipeStr ? parseInt(recipeData.servingsPerRecipeStr) : r.servingsPerRecipe,
    } : r));
    toast({ title: "Recipe Updated", description: `${recipeData.name} has been successfully updated.` });
  };

  const deleteRecipe = (recipeId: string) => {
    // Also check if recipe is used in any banquets, if so, prevent deletion or warn.
    // For now, simple deletion.
    const recipeName = getRecipeById(recipeId)?.name || "Recipe";
    setRecipes(prev => prev.filter(r => r.id !== recipeId));
    toast({ title: "Recipe Deleted", description: `${recipeName} has been deleted.`, variant: "destructive" });
  };

  const addBanquet = (banquetData: BanquetFormData) => {
    const newBanquet: Banquet = { 
      ...banquetData, 
      id: generateId(),
      guestCount: banquetData.guestCountStr ? parseInt(banquetData.guestCountStr) : 0,
    };
    setBanquets(prev => [...prev, newBanquet]);
    toast({ title: "Banquet Added", description: `${newBanquet.name} has been successfully added.` });
  };

  const updateBanquet = (banquetId: string, banquetData: BanquetFormData) => {
    setBanquets(prev => prev.map(b => b.id === banquetId ? { 
      ...b, 
      ...banquetData,
      guestCount: banquetData.guestCountStr ? parseInt(banquetData.guestCountStr) : b.guestCount,
    } : b));
    toast({ title: "Banquet Updated", description: `${banquetData.name} has been successfully updated.` });
  };

  const deleteBanquet = (banquetId: string) => {
    const banquetName = getBanquetById(banquetId)?.name || "Banquet";
    setBanquets(prev => prev.filter(b => b.id !== banquetId));
    // Also delete associated waste entries
    setWasteEntries(prev => prev.filter(w => w.banquetId !== banquetId));
    toast({ title: "Banquet Deleted", description: `${banquetName} has been deleted.`, variant: "destructive" });
  };

  const addWasteEntry = (banquetId: string, wasteData: WasteEntryFormData) => {
    const newWasteEntry: WasteEntry = {
      ...wasteData,
      id: generateId(),
      banquetId,
      dateRecorded: new Date().toISOString(),
      wastedQuantity: wasteData.wastedQuantityStr ? parseFloat(wasteData.wastedQuantityStr) : 0,
    };
    setWasteEntries(prev => [...prev, newWasteEntry]);
    toast({ title: "Waste Entry Added", description: `Waste for ${wasteData.ingredientName} has been logged.` });
  };
  
  const getWasteEntriesByBanquet = useCallback((banquetId: string) => {
    return wasteEntries.filter(w => w.banquetId === banquetId);
  }, [wasteEntries]);

  const getWasteEntriesByRecipeForAI = useCallback((targetRecipeName: string) => {
    const relevantWaste = wasteEntries.filter(waste => {
      const recipe = getRecipeById(waste.recipeId);
      return recipe?.name === targetRecipeName;
    });

    return relevantWaste.map(waste => {
      const banquet = getBanquetById(waste.banquetId);
      return {
        ingredient: waste.ingredientName,
        wastedQuantity: waste.wastedQuantity,
        unit: waste.unit,
        numberOfServings: banquet?.guestCount || 0, // Or servings tied to recipe in banquet context
      };
    });
  }, [wasteEntries, getRecipeById, getBanquetById]);


  return (
    <AppContext.Provider value={{ 
      recipes, addRecipe, updateRecipe, deleteRecipe, getRecipeById,
      banquets, addBanquet, updateBanquet, deleteBanquet, getBanquetById,
      wasteEntries, addWasteEntry, getWasteEntriesByBanquet, getWasteEntriesByRecipeForAI
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
