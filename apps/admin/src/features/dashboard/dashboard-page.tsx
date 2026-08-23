import { Link } from "react-router-dom";
import { FolderKanban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export function DashboardPage() {
  const { usuario } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hola, {usuario?.nombre?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Resumen de tu sitio.</p>
      </div>

      <Link to="/proyectos" className="block max-w-xs focus-visible:outline-2 focus-visible:outline-ring rounded-lg">
        <Card className="transition-colors hover:border-primary/50">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <FolderKanban className="h-5 w-5 text-primary" aria-hidden="true" />
            <CardTitle>Proyectos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Gestiona tu portafolio.</CardContent>
        </Card>
      </Link>
    </div>
  );
}
