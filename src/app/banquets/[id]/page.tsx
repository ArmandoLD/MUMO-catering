"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import type { Banquet, Recipe, WasteEntry } from "@/lib/types";
import { IngredientCalculator } from "@/components/banquets/IngredientCalculator";
import { WasteTracker } from "@/components/banquets/WasteTracker";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Users, Edit3, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function BanquetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const banquetId = params.id as string;
  const { 
    getBanquetById, 
    getRecipeById, 
    recipes: allRecipes, 
    getWasteEntriesByBanquet,
    addWasteEntry,
    deleteBanquet
  } = useAppContext();

  const [banquet, setBanquet] = useState<Banquet | null>(null);
  const [banquetRecipes, setBanquetRecipes] = useState<Recipe[]>([]);
  const [wasteEntries, setWasteEntries] = useState<WasteEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (banquetId) {
      const fetchedBanquet = getBanquetById(banquetId);
      if (fetchedBanquet) {
        setBanquet(fetchedBanquet);
        const menuRecipes = fetchedBanquet.menu
          .map(item => getRecipeById(item.recipeId))
          .filter(Boolean) as Recipe[];
        setBanquetRecipes(menuRecipes);
        setWasteEntries(getWasteEntriesByBanquet(banquetId));
      } else {
        // Banquet not found, redirect or show error
        router.push("/banquets");
      }
      setLoading(false);
    }
  }, [banquetId, getBanquetById, getRecipeById, getWasteEntriesByBanquet, router]);

  const handleDeleteBanquet = () => {
    if (banquet) {
      deleteBanquet(banquet.id);
      router.push("/banquets");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-40 w-full" />
        <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-60 w-full" />
            <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  if (!banquet) {
    return <div className="container mx-auto py-8 text-center">Banquet not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Banquets
      </Button>

      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
            <div>
              <CardTitle className="text-3xl font-bold text-primary">{banquet.name}</CardTitle>
              <CardDescription className="mt-1 text-lg">
                <span className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-muted-foreground" /> {format(new Date(banquet.date), "PPPP")}</span>
                <span className="flex items-center gap-2 mt-1"><Users className="w-5 h-5 text-muted-foreground" /> {banquet.guestCount} Guests</span>
              </CardDescription>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Link href={`/banquets/${banquet.id}/edit`} passHref>
                <Button variant="outline" size="sm"><Edit3 className="mr-2 h-4 w-4" />Edit</Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={handleDeleteBanquet}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-2 mt-4">Menu</h3>
          {banquetRecipes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {banquetRecipes.map(recipe => (
                <Badge key={recipe.id} variant="default" className="text-sm px-3 py-1">{recipe.name}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recipes selected for this banquet.</p>
          )}
        </CardContent>
      </Card>
      
      <Separator className="my-8" />

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
        <IngredientCalculator banquet={banquet} recipes={allRecipes} />
        <WasteTracker 
          banquet={banquet} 
          recipes={allRecipes} 
          wasteEntries={wasteEntries}
          onAddWasteEntry={(banquetId, data) => {
            addWasteEntry(banquetId, data);
            // Re-fetch or update waste entries locally
            setWasteEntries(getWasteEntriesByBanquet(banquetId));
          }}
        />
      </div>
    </div>
  );
}
