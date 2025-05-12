"use client";
import type { Banquet, Recipe } from "@/lib/types";
import { BanquetCard } from "./BanquetCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, PartyPopper } from "lucide-react";

interface BanquetListProps {
  banquets: Banquet[];
  recipes: Recipe[];
  onDeleteBanquet: (banquetId: string) => void;
}

export function BanquetList({ banquets, recipes, onDeleteBanquet }: BanquetListProps) {
  if (banquets.length === 0) {
    return (
      <div className="text-center py-10">
        <PartyPopper className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Aún No Hay Banquetes</h2>
        <p className="text-muted-foreground mb-4">¡Comienza planificando tu primer evento!</p>
        <Link href="/banquets/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Banquete
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {banquets.map((banquet) => (
        <BanquetCard key={banquet.id} banquet={banquet} recipes={recipes} onDelete={onDeleteBanquet} />
      ))}
    </div>
  );
}
