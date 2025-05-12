"use client";
import type { Banquet, Recipe, WasteEntry, WasteEntryFormData } from "@/lib/types";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, ListChecks } from "lucide-react";
import { format } from "date-fns";

const wasteEntryFormSchema = z.object({
  recipeId: z.string().min(1, "Recipe selection is required"),
  ingredientName: z.string().min(1, "Ingredient name is required"),
  wastedQuantityStr: z.string().min(1, "Wasted quantity is required").refine(val => /^\d*\.?\d+$/.test(val) && parseFloat(val) > 0, {
    message: "Quantity must be a positive number",
  }),
  unit: z.string().min(1, "Unit is required"),
  reason: z.string().optional(),
});

type FormValues = z.infer<typeof wasteEntryFormSchema>;

interface WasteTrackerProps {
  banquet: Banquet;
  recipes: Recipe[]; // All recipes for selection, and to find ingredients for selected recipe
  wasteEntries: WasteEntry[];
  onAddWasteEntry: (banquetId: string, data: WasteEntryFormData) => void;
}

export function WasteTracker({ banquet, recipes, wasteEntries, onAddWasteEntry }: WasteTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const { control, handleSubmit, register, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(wasteEntryFormSchema),
    defaultValues: { recipeId: "", ingredientName: "", wastedQuantityStr: "", unit: "", reason: "" },
  });

  const selectedRecipeId = watch("recipeId");
  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);

  const processSubmit = (data: FormValues) => {
    onAddWasteEntry(banquet.id, {
      ...data,
      wastedQuantity: parseFloat(data.wastedQuantityStr), // Ensure it's passed as number
    });
    reset();
    setShowForm(false);
  };

  const banquetMenuRecipes = banquet.menu.map(mi => recipes.find(r => r.id === mi.recipeId)).filter(Boolean) as Recipe[];

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ListChecks className="w-5 h-5 text-primary" />
            Food Waste Log
          </CardTitle>
          <CardDescription>Track ingredients wasted during this banquet.</CardDescription>
        </div>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Log Waste
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 mb-6 p-4 border rounded-md bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipeId">Recipe from Banquet Menu</Label>
                <Controller
                  name="recipeId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select a recipe" /></SelectTrigger>
                      <SelectContent>
                        {banquetMenuRecipes.map(recipe => (
                          <SelectItem key={recipe.id} value={recipe.id}>{recipe.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.recipeId && <p className="text-sm text-destructive mt-1">{errors.recipeId.message}</p>}
              </div>
              <div>
                <Label htmlFor="ingredientName">Ingredient Name</Label>
                 <Controller
                  name="ingredientName"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedRecipe}>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedRecipe ? "Select an ingredient" : "Select recipe first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedRecipe?.ingredients.map(ing => (
                          <SelectItem key={ing.id} value={ing.name}>{ing.name}</SelectItem>
                        ))}
                        <SelectItem value="Other">Other (Specify Below)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {watch("ingredientName") === "Other" && (
                     <Input {...register("ingredientName")} placeholder="Specify ingredient" className="mt-2"/>
                )}
                {errors.ingredientName && <p className="text-sm text-destructive mt-1">{errors.ingredientName.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wastedQuantityStr">Wasted Quantity</Label>
                <Input id="wastedQuantityStr" type="number" step="any" {...register("wastedQuantityStr")} placeholder="e.g., 0.5" />
                {errors.wastedQuantityStr && <p className="text-sm text-destructive mt-1">{errors.wastedQuantityStr.message}</p>}
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" {...register("unit")} placeholder="e.g., kg, pcs, L" />
                {errors.unit && <p className="text-sm text-destructive mt-1">{errors.unit.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea id="reason" {...register("reason")} placeholder="e.g., Overcooked, Expired" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); reset(); }}>Cancel</Button>
              <Button type="submit">Add Entry</Button>
            </div>
          </form>
        )}

        {wasteEntries.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Recipe</TableHead>
                <TableHead>Ingredient</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteEntries.sort((a,b) => new Date(b.dateRecorded).getTime() - new Date(a.dateRecorded).getTime()).map(entry => (
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.dateRecorded), "PP")}</TableCell>
                  <TableCell>{recipes.find(r => r.id === entry.recipeId)?.name || 'N/A'}</TableCell>
                  <TableCell>{entry.ingredientName}</TableCell>
                  <TableCell className="text-right">{entry.wastedQuantity}</TableCell>
                  <TableCell>{entry.unit}</TableCell>
                  <TableCell>{entry.reason || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          !showForm && <p className="text-muted-foreground text-center py-4">No waste entries logged for this banquet yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
