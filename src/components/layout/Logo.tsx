import { ChefHat } from 'lucide-react';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-2xl font-bold text-primary ${className}`}>
      <ChefHat className="h-7 w-7" />
      <span>MUMO catering</span>
    </Link>
  );
}
