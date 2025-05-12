"use client";
import { BanquetForm } from "@/components/banquets/BanquetForm";
import { useAppContext } from "@/context/AppContext";
import type { BanquetFormData } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditBanquetPage() {
  const { getBanquetById, updateBanquet, recipes: allRecipes } = useAppContext();
  const router = useRouter();
  const params = useParams();
  const banquetId = params.id as string;
  
  const [banquet, setBanquet] = useState<BanquetFormData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (banquetId) {
      const fetchedBanquet = getBanquetById(banquetId);
      if (fetchedBanquet) {
        setBanquet({
          ...fetchedBanquet,
          guestCountStr: fetchedBanquet.guestCount.toString(),
        });
      } else {
        router.push('/banquets'); 
      }
      setLoading(false);
    }
  }, [banquetId, getBanquetById, router]);

  const handleSubmit = (data: BanquetFormData) => {
    if (banquetId) {
      updateBanquet(banquetId, data);
      router.push(`/banquets/${banquetId}`);
    }
  };

  if (loading) {
    return (
        <div className="container mx-auto py-8">
            <Skeleton className="h-[500px] w-full max-w-2xl mx-auto" />
        </div>
    )
  }

  if (!banquet) {
    return <div className="container mx-auto py-8 text-center">Banquet not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <BanquetForm initialData={banquet} allRecipes={allRecipes} onSubmit={handleSubmit} isEditing />
    </div>
  );
}
