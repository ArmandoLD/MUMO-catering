"use client";

import type { Ingredient, RecipeFormData } from "@/lib/types";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

const ingredientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre del ingrediente es obligatorio"),
  quantity: z.number().min(0.01, "La cantidad debe ser positiva"),
  unit: z.string().min(1, "La unidad es obligatoria"),
});

const recipeFormSchema = z.object({
  name: z.string().min(1, "El nombre de la receta es obligatorio"),
  description: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1, "Se requiere al menos un ingrediente"),
  instructions: z.string().optional(),
  servingsPerRecipeStr: z.string().optional().refine(val => !val || /^\d+$/.test(val), {
    message: "Las porciones deben ser un número entero",
  }).refine(val => !val || parseInt(val) > 0, {
    message: "Las porciones deben ser mayores que 0",
  }),
});


type FormValues = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (data: RecipeFormData) => void;
  isEditing?: boolean;
}

export function RecipeForm({ initialData, onSubmit, isEditing = false }: RecipeFormProps) {
  const router = useRouter();
  const { control, handleSubmit, register, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      ingredients: initialData?.ingredients.map(ing => ({...ing, quantity: Number(ing.quantity)})) || [{ name: "", quantity: 1, unit: "" }],
      instructions: initialData?.instructions || "",
      servingsPerRecipeStr: initialData?.servingsPerRecipe?.toString() || "1",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const processSubmit = (data: FormValues) => {
    const processedData: RecipeFormData = {
      ...data,
      servingsPerRecipeStr: data.servingsPerRecipeStr,
      ingredients: data.ingredients.map(ing => ({
        ...ing,
        quantity: Number(ing.quantity) // Ensure quantity is a number
      }))
    };
    onSubmit(processedData);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Receta" : "Añadir Nueva Receta"}</CardTitle>
        <CardDescription>{isEditing ? "Actualiza los detalles de tu receta." : "Completa los detalles para tu nueva receta."}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name">Nombre de la Receta</Label>
            <Input id="name" {...register("name")} placeholder="Ej: Pastel de Chocolate" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Textarea id="description" {...register("description")} placeholder="Un breve resumen de la receta" />
          </div>
          
          <div>
            <Label htmlFor="servingsPerRecipeStr">Porciones por Receta (Opcional)</Label>
            <Input id="servingsPerRecipeStr" type="number" {...register("servingsPerRecipeStr")} placeholder="Ej: 4" min="1"/>
            {errors.servingsPerRecipeStr && <p className="text-sm text-destructive mt-1">{errors.servingsPerRecipeStr.message}</p>}
          </div>

          <div>
            <Label>Ingredientes</Label>
            <ScrollArea className="h-[200px] border rounded-md p-2 mt-1">
              <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-end p-2 border rounded-md bg-muted/30">
                  <div>
                    <Label htmlFor={`ingredients.${index}.name`} className="sr-only">Nombre</Label>
                    <Input
                      {...register(`ingredients.${index}.name`)}
                      placeholder="Nombre del Ingrediente"
                      className="text-sm"
                    />
                    {errors.ingredients?.[index]?.name && <p className="text-xs text-destructive mt-1">{errors.ingredients[index]?.name?.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor={`ingredients.${index}.quantity`} className="sr-only">Cant.</Label>
                    <Input
                      type="number"
                      step="any"
                      {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                      placeholder="Cant."
                      className="w-20 text-sm"
                    />
                    {errors.ingredients?.[index]?.quantity && <p className="text-xs text-destructive mt-1">{errors.ingredients[index]?.quantity?.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor={`ingredients.${index}.unit`} className="sr-only">Unidad</Label>
                    <Input
                      {...register(`ingredients.${index}.unit`)}
                      placeholder="Unidad"
                      className="w-24 text-sm"
                    />
                    {errors.ingredients?.[index]?.unit && <p className="text-xs text-destructive mt-1">{errors.ingredients[index]?.unit?.message}</p>}
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              </div>
            </ScrollArea>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", quantity: 1, unit: "" })} className="mt-2">
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Ingrediente
            </Button>
            {errors.ingredients && typeof errors.ingredients.message === 'string' && <p className="text-sm text-destructive mt-1">{errors.ingredients.message}</p>}
          </div>

          <div>
            <Label htmlFor="instructions">Instrucciones (Opcional)</Label>
            <Textarea id="instructions" {...register("instructions")} placeholder="Instrucciones de preparación paso a paso" rows={5} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit">{isEditing ? "Guardar Cambios" : "Añadir Receta"}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
