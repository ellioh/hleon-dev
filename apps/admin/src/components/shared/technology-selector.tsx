import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTecnologias } from "@/hooks/use-lookups";

interface TechnologySelectorProps {
  value: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
}

/**
 * Multi-select de Tecnologías - checkboxes en vez de un combobox custom:
 * misma información, navegable por teclado y compatible con lectores de
 * pantalla sin construir un widget nuevo desde cero.
 */
export function TechnologySelector({ value, onChange, disabled }: TechnologySelectorProps) {
  const { data: tecnologias, isLoading } = useTecnologias();

  if (isLoading) return <Skeleton className="h-32 w-full" />;

  const seleccionadas = tecnologias?.filter((t) => value.includes(t.id)) ?? [];

  function alternar(id: number) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  return (
    <div className="space-y-3">
      {seleccionadas.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-live="polite">
          {seleccionadas.map((t) => (
            <Badge key={t.id} variant="secondary" className="gap-1 pr-1">
              {t.nombre}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => alternar(t.id)}
                  className="rounded-full p-0.5 hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label={`Quitar ${t.nombre}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      <fieldset
        className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto rounded-md border border-input p-3 sm:grid-cols-3"
        disabled={disabled}
      >
        <legend className="sr-only">Tecnologías del proyecto</legend>
        {tecnologias?.map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            <Checkbox
              id={`tec-${t.id}`}
              checked={value.includes(t.id)}
              onCheckedChange={() => alternar(t.id)}
            />
            <Label htmlFor={`tec-${t.id}`} className="cursor-pointer font-normal">
              {t.nombre}
            </Label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}
