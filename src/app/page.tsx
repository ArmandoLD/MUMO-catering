
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChefHat, PartyPopper, Sparkles, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary">Bienvenido a MUMO catering</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Optimiza tus operaciones de catering, desde la receta hasta el banquete, y minimiza el desperdicio.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col max-w-sm mx-auto">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <ChefHat className="text-accent" />
              Gestionar Recetas
            </CardTitle>
            <CardDescription className="mt-2 px-2 min-h-[60px] text-center">Crea, edita y organiza tus obras maestras culinarias.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow pt-2 px-6">
            <p className="mb-6 text-center text-sm text-foreground flex-grow min-h-[80px]">Mantén todas tus recetas en un solo lugar con ingredientes e instrucciones detalladas.</p>
            <Link href="/recipes" passHref className="mt-auto">
              <Button className="w-full" variant="default">Ir a Recetas</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col max-w-sm mx-auto">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <PartyPopper className="text-accent" />
              Banquetes
            </CardTitle>
            <CardDescription className="mt-2 px-2 min-h-[60px] text-center">Organiza eventos, gestiona listas de invitados y planifica menús.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow pt-2 px-6">
            <p className="mb-6 text-center text-sm text-foreground flex-grow min-h-[80px]">Planifica tus banquetes sin esfuerzo, calcula las necesidades de ingredientes y registra los detalles del evento.</p>
            <Link href="/banquets" passHref className="mt-auto">
              <Button className="w-full" variant="default">Ir a Banquetes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col max-w-sm mx-auto">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Sparkles className="text-accent" />
              Desperdicios
            </CardTitle>
            <CardDescription className="mt-2 px-2 min-h-[60px] text-center">Obtén sugerencias con IA para minimizar el desperdicio de alimentos.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow pt-2 px-6">
            <p className="mb-6 text-center text-sm text-foreground flex-grow min-h-[80px]">Aprovecha los datos históricos y los conocimientos de IA para optimizar el uso de ingredientes y reducir el deterioro.</p>
            <Link href="/waste-reduction" passHref className="mt-auto">
              <Button className="w-full" variant="default">Obtener Sugerencias de IA</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12 py-8 bg-secondary/50 rounded-lg">
        <div className="container mx-auto text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-semibold mb-3">Optimiza Tu Negocio de Catering</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                MUMO catering te ayuda a tomar decisiones basadas en datos para mejorar la eficiencia, reducir costos y ofrecer experiencias culinarias excepcionales.
            </p>
        </div>
      </section>
    </div>
  );
}
