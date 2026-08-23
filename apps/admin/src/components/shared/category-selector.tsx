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

  return (
    <Select value={value ? String(value) : undefined} onValueChange={(v) => onChange(Number(v))} disabled={disabled}>
      <SelectTrigger aria-label="Categoría">
        <SelectValue placeholder="Selecciona una categoría" />
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
