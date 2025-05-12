"use client";
import { BanquetForm } from "@/components/banquets/BanquetForm";
import { useAppContext } from "@/context/AppContext";
import type { BanquetFormData } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function NewBanquetPage() {
  const { addBanquet, recipes } = useAppContext();
  const router = useRouter();

  const handleSubmit = (data: BanquetFormData) => {
    addBanquet(data);
    router.push("/banquets");
  };

  return (
    <div className="container mx-auto py-8">
      <BanquetForm onSubmit={handleSubmit} allRecipes={recipes} />
    </div>
  );
}
