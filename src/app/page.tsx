import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChefHat, PartyPopper, Sparkles, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary">Welcome to CateringFlow</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Streamline your catering operations, from recipe to banquet, and minimize waste.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ChefHat className="text-accent" />
              Manage Recipes
            </CardTitle>
            <CardDescription>Create, edit, and organize your culinary masterpieces.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Keep all your recipes in one place with detailed ingredients and instructions.</p>
            <Link href="/recipes" passHref>
              <Button className="w-full" variant="outline">Go to Recipes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <PartyPopper className="text-accent" />
              Plan Banquets
            </CardTitle>
            <CardDescription>Organize events, manage guest lists, and plan menus.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Effortlessly plan your banquets, calculate ingredient needs, and track event details.</p>
            <Link href="/banquets" passHref>
              <Button className="w-full" variant="outline">Go to Banquets</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="text-accent" />
              Reduce Waste
            </CardTitle>
            <CardDescription>Get AI-powered suggestions to minimize food waste.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Leverage historical data and AI insights to optimize ingredient usage and reduce spoilage.</p>
            <Link href="/waste-reduction" passHref>
              <Button className="w-full" variant="outline">Get AI Suggestions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12 py-8 bg-secondary/50 rounded-lg">
        <div className="container mx-auto text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-semibold mb-3">Optimize Your Catering Business</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                CateringFlow helps you make data-driven decisions to improve efficiency, cut costs, and deliver exceptional culinary experiences.
            </p>
        </div>
      </section>
    </div>
  );
}
