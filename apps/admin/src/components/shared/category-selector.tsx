import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategorias } from "@/hooks/use-lookups";

interface CategorySelectorProps {
  value: number | null;
  onChange: (id: number) => void;
  disabled?: boolean;
}

/** Selector de Categoría - reutilizable por Proyecto, Post y Servicio (misma tabla maestra). */
export function CategorySelector({ value, onChange, disabled }: CategorySelectorProps) {
  const { data: categorias, isLoading } = useCategorias();

  if (isLoading) return <Skeleton className="h-10 w-full" />;

  // Ver organizacion-selector.tsx para el porqué de estos dos detalles:
  // Select siempre controlado (nunca `undefined`) y la etiqueta resuelta
  // a mano como children de SelectValue - un valor fijado
  // programáticamente (p.ej. `form.reset()` al cargar el formulario de
  // edición) no pasa por Radix de la misma forma que un clic directo.
  const seleccionada = categorias?.find((cat) => cat.id === value);

  return (
    <Select value={value ? String(value) : ""} onValueChange={(v) => onChange(Number(v))} disabled={disabled}>
      <SelectTrigger aria-label="Categoría">
        <SelectValue placeholder="Selecciona una categoría">{seleccionada?.nombre}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {categorias?.map((cat) => (
          <SelectItem key={cat.id} value={String(cat.id)}>
            {cat.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
