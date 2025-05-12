"use client";
import { BanquetList } from "@/components/banquets/BanquetList";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { PlusCircle, PartyPopper } from "lucide-react";
import Link from "next/link";

export default function BanquetsPage() {
  const { banquets, recipes, deleteBanquet } = useAppContext();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
          <PartyPopper className="w-10 h-10 text-primary" /> Tus Banquetes
        </h1>
        <Link href="/banquets/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Banquete
          </Button>
        </Link>
      </div>
      <BanquetList banquets={banquets} recipes={recipes} onDeleteBanquet={deleteBanquet} />
    </div>
  );
}
