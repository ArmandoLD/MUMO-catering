"use client";
import type { Banquet, Recipe } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Utensils, Edit3, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Import Spanish locale
import { Badge } from "@/components/ui/badge";

interface BanquetCardProps {
  banquet: Banquet;
  recipes: Recipe[]; // To display recipe names in menu
  onDelete: (banquetId: string) => void;
}

export function BanquetCard({ banquet, recipes, onDelete }: BanquetCardProps) {
  const getRecipeName = (recipeId: string) => {
    return recipes.find(r => r.id === recipeId)?.name || "Receta Desconocida";
  };

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">{banquet.name}</CardTitle>
        <CardDescription className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm">
          <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4 text-muted-foreground" /> {format(new Date(banquet.date), "PPP", { locale: es })}</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4 text-muted-foreground" /> {banquet.guestCount} Comensales</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-3">
          <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
            <Utensils className="w-4 h-4 text-muted-foreground" /> Menú:
          </h4>
          {banquet.menu.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1">
              {banquet.menu.slice(0, 4).map((item, index) => (
                <Badge key={index} variant="secondary">{getRecipeName(item.recipeId)}</Badge>
              ))}
              {banquet.menu.length > 4 && <Badge variant="secondary">...</Badge>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay platos seleccionados en el menú.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Link href={`/banquets/${banquet.id}`} passHref>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" /> Detalles
          </Button>
        </Link>
        <Link href={`/banquets/${banquet.id}/edit`} passHref>
          <Button variant="outline" size="sm">
            <Edit3 className="mr-2 h-4 w-4" /> Editar
          </Button>
        </Link>
        <Button variant="destructive" size="sm" onClick={() => onDelete(banquet.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}
