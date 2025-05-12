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
    toast({ title: "Receta Añadida", description: `${newRecipe.name} ha sido añadida exitosamente.` });
  };

  const updateRecipe = (recipeId: string, recipeData: RecipeFormData) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { 
      ...r, 
      ...recipeData, 
      ingredients: recipeData.ingredients.map(ing => ({ ...ing, id: ing.id || generateId() })),
      servingsPerRecipe: recipeData.servingsPerRecipeStr ? parseInt(recipeData.servingsPerRecipeStr) : r.servingsPerRecipe,
    } : r));
    toast({ title: "Receta Actualizada", description: `${recipeData.name} ha sido actualizada exitosamente.` });
  };

  const deleteRecipe = (recipeId: string) => {
    const recipeName = getRecipeById(recipeId)?.name || "La receta";
    setRecipes(prev => prev.filter(r => r.id !== recipeId));
    toast({ title: "Receta Eliminada", description: `${recipeName} ha sido eliminada.`, variant: "destructive" });
  };

  const addBanquet = (banquetData: BanquetFormData) => {
    const newBanquet: Banquet = { 
      ...banquetData, 
      id: generateId(),
      guestCount: banquetData.guestCountStr ? parseInt(banquetData.guestCountStr) : 0,
    };
    setBanquets(prev => [...prev, newBanquet]);
    toast({ title: "Banquete Añadido", description: `${newBanquet.name} ha sido añadido exitosamente.` });
  };

  const updateBanquet = (banquetId: string, banquetData: BanquetFormData) => {
    setBanquets(prev => prev.map(b => b.id === banquetId ? { 
      ...b, 
      ...banquetData,
      guestCount: banquetData.guestCountStr ? parseInt(banquetData.guestCountStr) : b.guestCount,
    } : b));
    toast({ title: "Banquete Actualizado", description: `${banquetData.name} ha sido actualizado exitosamente.` });
  };

  const deleteBanquet = (banquetId: string) => {
    const banquetName = getBanquetById(banquetId)?.name || "El banquete";
    setBanquets(prev => prev.filter(b => b.id !== banquetId));
    setWasteEntries(prev => prev.filter(w => w.banquetId !== banquetId));
    toast({ title: "Banquete Eliminado", description: `${banquetName} ha sido eliminado.`, variant: "destructive" });
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
    toast({ title: "Registro de Desperdicio Añadido", description: `El desperdicio de ${wasteData.ingredientName} ha sido registrado.` });
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
        numberOfServings: banquet?.guestCount || 0, 
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
