import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";

/** Error de carga reutilizable - distingue mensaje de la API del genérico. */
export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const mensaje = error instanceof ApiError ? error.message : "Ocurrió un error inesperado.";

  return (
    <Alert variant="destructive">
      <AlertTriangle aria-hidden="true" />
      <AlertTitle>No se pudo cargar la información</AlertTitle>
      <AlertDescription>
        <p>{mensaje}</p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
