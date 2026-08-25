import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useProyectos } from "@/features/proyectos/api";

interface ProyectoEjemploSelectorProps {
  value: number | null;
  onChange: (id: number | null) => void;
  disabled?: boolean;
}

const SIN_PROYECTO = "ninguno";

/**
 * Selector de un solo proyecto de ejemplo (a diferencia del multi-select
 * de Experiencia) - local a Servicios mientras sea el único consumidor.
 * Siempre controlado (nunca `undefined`) y con la etiqueta resuelta a
 * mano como children de SelectValue, mismo fix que organizacion-selector.tsx
 * (ver ADR 0007) - evita el bug real de Select no-controlado/controlado
 * de Radix.
 */
export function ProyectoEjemploSelector({ value, onChange, disabled }: ProyectoEjemploSelectorProps) {
  const { data, isLoading } = useProyectos({});
  const proyectos = data?.data ?? [];

  if (isLoading) return <Skeleton className="h-10 w-full" />;

  const seleccionado = proyectos.find((p) => p.id === value);

  return (
    <Select
      value={value ? String(value) : SIN_PROYECTO}
      onValueChange={(v) => onChange(v === SIN_PROYECTO ? null : Number(v))}
      disabled={disabled}
    >
      <SelectTrigger aria-label="Proyecto de ejemplo">
        <SelectValue placeholder="Sin proyecto de ejemplo">{seleccionado?.nombre ?? "Sin proyecto de ejemplo"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={SIN_PROYECTO}>Sin proyecto de ejemplo</SelectItem>
        {proyectos.map((p) => (
          <SelectItem key={p.id} value={String(p.id)}>
            {p.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
