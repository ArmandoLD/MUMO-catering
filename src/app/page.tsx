import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChefHat, PartyPopper, Sparkles, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary">Bienvenido a CateringFlow</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Optimiza tus operaciones de catering, desde la receta hasta el banquete, y minimiza el desperdicio.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <ChefHat className="text-accent" />
              Gestionar Recetas
            </CardTitle>
            <CardDescription className="text-center">Crea, edita y organiza tus obras maestras culinarias.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-center">Mantén todas tus recetas en un solo lugar con ingredientes e instrucciones detalladas.</p>
            <Link href="/recipes" passHref>
              <Button className="w-full" variant="outline">Ir a Recetas</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <PartyPopper className="text-accent" />
              Planificar Banquetes
            </CardTitle>
            <CardDescription className="text-center">Organiza eventos, gestiona listas de invitados y planifica menús.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-center">Planifica tus banquetes sin esfuerzo, calcula las necesidades de ingredientes y registra los detalles del evento.</p>
            <Link href="/banquets" passHref>
              <Button className="w-full" variant="outline">Ir a Banquetes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Sparkles className="text-accent" />
              Reducir Desperdicios
            </CardTitle>
            <CardDescription className="text-center">Obtén sugerencias con IA para minimizar el desperdicio de alimentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-center">Aprovecha los datos históricos y los conocimientos de IA para optimizar el uso de ingredientes y reducir el deterioro.</p>
            <Link href="/waste-reduction" passHref>
              <Button className="w-full" variant="outline">Obtener Sugerencias de IA</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12 py-8 bg-secondary/50 rounded-lg">
        <div className="container mx-auto text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-semibold mb-3">Optimiza Tu Negocio de Catering</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                CateringFlow te ayuda a tomar decisiones basadas en datos para mejorar la eficiencia, reducir costos y ofrecer experiencias culinarias excepcionales.
            </p>
        </div>
      </section>
    </div>
  );
}
