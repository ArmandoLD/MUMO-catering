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
import { es } from "date-fns/locale"; // Import Spanish locale

const wasteEntryFormSchema = z.object({
  recipeId: z.string().min(1, "La selección de receta es obligatoria"),
  ingredientName: z.string().min(1, "El nombre del ingrediente es obligatorio"),
  wastedQuantityStr: z.string().min(1, "La cantidad desperdiciada es obligatoria").refine(val => /^\d*\.?\d+$/.test(val) && parseFloat(val) > 0, {
    message: "La cantidad debe ser un número positivo",
  }),
  unit: z.string().min(1, "La unidad es obligatoria"),
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
            Registro de Desperdicio de Alimentos
          </CardTitle>
          <CardDescription>Registra los ingredientes desperdiciados durante este banquete.</CardDescription>
        </div>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Registrar Desperdicio
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 mb-6 p-4 border rounded-md bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipeId">Receta del Menú del Banquete</Label>
                <Controller
                  name="recipeId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Selecciona una receta" /></SelectTrigger>
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
                <Label htmlFor="ingredientName">Nombre del Ingrediente</Label>
                 <Controller
                  name="ingredientName"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedRecipe}>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedRecipe ? "Selecciona un ingrediente" : "Selecciona receta primero"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedRecipe?.ingredients.map(ing => (
                          <SelectItem key={ing.id} value={ing.name}>{ing.name}</SelectItem>
                        ))}
                        <SelectItem value="Other">Otro (Especificar Abajo)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {watch("ingredientName") === "Other" && (
                     <Input {...register("ingredientName")} placeholder="Especificar ingrediente" className="mt-2"/>
                )}
                {errors.ingredientName && <p className="text-sm text-destructive mt-1">{errors.ingredientName.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wastedQuantityStr">Cantidad Desperdiciada</Label>
                <Input id="wastedQuantityStr" type="number" step="any" {...register("wastedQuantityStr")} placeholder="Ej: 0.5" />
                {errors.wastedQuantityStr && <p className="text-sm text-destructive mt-1">{errors.wastedQuantityStr.message}</p>}
              </div>
              <div>
                <Label htmlFor="unit">Unidad</Label>
                <Input id="unit" {...register("unit")} placeholder="Ej: kg, unidades, L" />
                {errors.unit && <p className="text-sm text-destructive mt-1">{errors.unit.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Motivo (Opcional)</Label>
              <Textarea id="reason" {...register("reason")} placeholder="Ej: Demasiado cocido, Caducado" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); reset(); }}>Cancelar</Button>
              <Button type="submit">Añadir Registro</Button>
            </div>
          </form>
        )}

        {wasteEntries.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Receta</TableHead>
                <TableHead>Ingrediente</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteEntries.sort((a,b) => new Date(b.dateRecorded).getTime() - new Date(a.dateRecorded).getTime()).map(entry => (
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.dateRecorded), "PP", { locale: es })}</TableCell>
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
          !showForm && <p className="text-muted-foreground text-center py-4">Aún no hay registros de desperdicio para este banquete.</p>
        )}
      </CardContent>
    </Card>
  );
}
