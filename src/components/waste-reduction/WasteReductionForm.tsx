"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, Loader2, Lightbulb, ServerCrash, ChefHat } from "lucide-react";
import { getWasteReductionSuggestions } from "@/lib/actions";
import type { AISuggestion, HistoricalWasteDataItem, Recipe } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const wasteReductionFormSchema = z.object({
  recipeName: z.string().min(1, "El nombre de la receta es obligatorio"),
  historicalWasteData: z.string().min(1, "Los datos históricos de desperdicio (formato JSON) son obligatorios")
    .refine((data) => {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) && parsed.every(item => 
          typeof item.ingredient === 'string' &&
          typeof item.wastedQuantity === 'number' &&
          typeof item.unit === 'string' &&
          typeof item.numberOfServings === 'number'
        );
      } catch (e) {
        return false;
      }
    }, "Debe ser un array JSON válido de datos históricos de desperdicio. Cada elemento necesita: ingredient (string), wastedQuantity (number), unit (string), numberOfServings (number)."),
});

type FormValues = z.infer<typeof wasteReductionFormSchema>;

export function WasteReductionForm() {
  const { recipes, getWasteEntriesByRecipeForAI } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, register, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(wasteReductionFormSchema),
    defaultValues: { recipeName: "", historicalWasteData: "" },
  });

  const selectedRecipeName = watch("recipeName");

  const handleRecipeSelect = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      setValue("recipeName", recipe.name);
      const wasteData = getWasteEntriesByRecipeForAI(recipe.name);
      setValue("historicalWasteData", JSON.stringify(wasteData, null, 2));
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    setAiSuggestion(null);

    const result = await getWasteReductionSuggestions(data.recipeName, data.historicalWasteData);

    if (result.data) {
      setAiSuggestion(result.data);
    } else if (result.error) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Sugerencias de Reducción de Desperdicios con IA
          </CardTitle>
          <CardDescription>
            Selecciona una receta o ingresa su nombre, y proporciona datos históricos de desperdicio (en formato JSON) para obtener sugerencias para ajustar las cantidades de ingredientes.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="recipeIdSelect">Seleccionar Receta (Autocompleta los Campos)</Label>
              <Select onValueChange={handleRecipeSelect}>
                <SelectTrigger id="recipeIdSelect">
                  <SelectValue placeholder="Selecciona una receta para autocompletar" />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map(recipe => (
                    <SelectItem key={recipe.id} value={recipe.id}>{recipe.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recipeName">Nombre de la Receta</Label>
              <Input id="recipeName" {...register("recipeName")} placeholder="Ej: Sopa de Tomate" />
              {errors.recipeName && <p className="text-sm text-destructive mt-1">{errors.recipeName.message}</p>}
            </div>

            <div>
              <Label htmlFor="historicalWasteData">Datos Históricos de Desperdicio (Array JSON)</Label>
              <Textarea
                id="historicalWasteData"
                {...register("historicalWasteData")}
                rows={8}
                placeholder={`[
  { "ingredient": "Tomates", "wastedQuantity": 0.5, "unit": "kg", "numberOfServings": 50 },
  { "ingredient": "Cebollas", "wastedQuantity": 0.2, "unit": "kg", "numberOfServings": 50 }
]`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Cada elemento debe incluir: "ingredient" (string), "wastedQuantity" (number), "unit" (string), "numberOfServings" (number).
              </p>
              {errors.historicalWasteData && <p className="text-sm text-destructive mt-1">{errors.historicalWasteData.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analizando...</>
              ) : (
                <><Lightbulb className="mr-2 h-4 w-4" /> Obtener Sugerencias</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <ServerCrash className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {aiSuggestion && (
        <Card className="shadow-lg bg-gradient-to-br from-primary/10 via-background to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-primary">
              <ChefHat className="w-7 h-7" />
              Sugerencias para {selectedRecipeName || watch("recipeName")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ingredientes Ajustados:</h3>
              {aiSuggestion.adjustedIngredients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingrediente</TableHead>
                      <TableHead>Nueva Cantidad Recomendada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiSuggestion.adjustedIngredients.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.ingredientName}</TableCell>
                        <TableCell>{item.newRecommendedQuantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No se proporcionaron ajustes específicos de ingredientes.</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Justificación:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{aiSuggestion.reasoning || "No se proporcionó justificación."}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
