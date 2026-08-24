import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useProyectos } from "@/features/proyectos/api";

interface ProyectoSelectorProps {
  value: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
}

/**
 * Multi-select de Proyectos del portafolio - mismo patrón que
 * TechnologySelector. Local a Experiencia por ahora: si otro módulo
 * necesita vincular proyectos (p.ej. Testimonios), promoverlo a
 * components/shared/ en ese momento, no antes.
 */
export function ProyectoSelector({ value, onChange, disabled }: ProyectoSelectorProps) {
  const { data, isLoading } = useProyectos({});
  const proyectos = data?.data ?? [];

  if (isLoading) return <Skeleton className="h-32 w-full" />;

  const seleccionados = proyectos.filter((p) => value.includes(p.id));

  function alternar(id: number) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  return (
    <div className="space-y-3">
      {seleccionados.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-live="polite">
          {seleccionados.map((p) => (
            <Badge key={p.id} variant="secondary" className="gap-1 pr-1">
              {p.nombre}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => alternar(p.id)}
                  className="rounded-full p-0.5 hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label={`Quitar ${p.nombre}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      <fieldset
        className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto rounded-md border border-input p-3 sm:grid-cols-2"
        disabled={disabled}
      >
        <legend className="sr-only">Proyectos realizados durante esta experiencia</legend>
        {proyectos.length === 0 && <p className="text-sm text-muted-foreground">Aún no hay proyectos creados.</p>}
        {proyectos.map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <Checkbox id={`proy-${p.id}`} checked={value.includes(p.id)} onCheckedChange={() => alternar(p.id)} />
            <Label htmlFor={`proy-${p.id}`} className="cursor-pointer font-normal">
              {p.nombre}
            </Label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}
