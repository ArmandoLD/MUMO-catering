"use client";

import type { BanquetFormData, Recipe, MenuItem } from "@/lib/types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, Utensils } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Import Spanish locale
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const banquetFormSchema = z.object({
  name: z.string().min(1, "El nombre del banquete es obligatorio"),
  date: z.date({ required_error: "La fecha del banquete es obligatoria" }),
  guestCountStr: z.string().min(1, "El número de comensales es obligatorio").refine(val => /^\d+$/.test(val) && parseInt(val) > 0, {
    message: "El número de comensales debe ser un número entero positivo",
  }),
  menu: z.array(z.object({ recipeId: z.string() })).min(1, "Se debe seleccionar al menos una receta para el menú"),
});

type FormValues = z.infer<typeof banquetFormSchema>;

interface BanquetFormProps {
  initialData?: BanquetFormData & { id?: string }; // id is needed for editing
  allRecipes: Recipe[];
  onSubmit: (data: BanquetFormData) => void;
  isEditing?: boolean;
}

export function BanquetForm({ initialData, allRecipes, onSubmit, isEditing = false }: BanquetFormProps) {
  const router = useRouter();
  const { control, handleSubmit, register, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(banquetFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      guestCountStr: initialData?.guestCountStr || initialData?.guestCount?.toString() || "10",
      menu: initialData?.menu || [],
    },
  });

  const selectedMenu = watch("menu");

  const processSubmit = (data: FormValues) => {
    const processedData: BanquetFormData = {
      ...data,
      date: data.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD string
      guestCountStr: data.guestCountStr,
      // menu is already in the correct { recipeId: string } format
    };
    onSubmit(processedData);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Banquete" : "Añadir Nuevo Banquete"}</CardTitle>
        <CardDescription>{isEditing ? "Actualiza los detalles de tu banquete." : "Planifica tu nuevo evento de banquete."}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name">Nombre del Banquete</Label>
            <Input id="name" {...register("name")} placeholder="Ej: Gala Anual de Caridad" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <Label htmlFor="guestCountStr">Número de Comensales</Label>
              <div className="relative">
                <Users className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="guestCountStr" type="number" {...register("guestCountStr")} placeholder="Ej: 50" className="pl-8" min="1" />
              </div>
              {errors.guestCountStr && <p className="text-sm text-destructive mt-1">{errors.guestCountStr.message}</p>}
            </div>
          </div>
          
          <div>
            <Label className="flex items-center gap-1"><Utensils className="w-4 h-4" /> Selección de Menú</Label>
            {allRecipes.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-2">No hay recetas disponibles. Por favor <Link href="/recipes/new" className="text-primary underline">añade una receta</Link> primero.</p>
            ) : (
              <ScrollArea className="h-[200px] border rounded-md p-3 mt-1 space-y-2 bg-muted/30">
                {allRecipes.map((recipe) => (
                  <div key={recipe.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-background transition-colors">
                    <Checkbox
                      id={`recipe-${recipe.id}`}
                      checked={selectedMenu.some(item => item.recipeId === recipe.id)}
                      onCheckedChange={(checked) => {
                        const currentMenu = selectedMenu;
                        if (checked) {
                          setValue("menu", [...currentMenu, { recipeId: recipe.id }]);
                        } else {
                          setValue("menu", currentMenu.filter(item => item.recipeId !== recipe.id));
                        }
                      }}
                    />
                    <Label htmlFor={`recipe-${recipe.id}`} className="font-normal cursor-pointer flex-1">
                      {recipe.name}
                    </Label>
                  </div>
                ))}
              </ScrollArea>
            )}
            {errors.menu && typeof errors.menu.message === 'string' && <p className="text-sm text-destructive mt-1">{errors.menu.message}</p>}
          </div>

        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" disabled={allRecipes.length === 0 && !isEditing}>{isEditing ? "Guardar Cambios" : "Añadir Banquete"}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
