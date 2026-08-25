import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TextListEditorProps {
  value: string[];
  onChange: (items: string[]) => void;
  /** Sustantivo singular para aria-labels y el botón de agregar - ej. "logro", "entregable". */
  itemLabel: string;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Lista ordenada de texto libre - reordenamiento por botones, mismo
 * patrón que GalleryUploader. Reutilizable por cualquier campo con esta
 * forma (`{ texto, orden }` en el backend): logros de Experiencia,
 * entregables de Servicio. Antes vivía duplicado como LogrosEditor
 * dentro de features/experiencia/; se generalizó al aparecer el mismo
 * patrón por tercera vez (ver ADR de Servicios).
 */
export function TextListEditor({ value, onChange, itemLabel, placeholder, disabled }: TextListEditorProps) {
  function actualizar(index: number, texto: string) {
    const copia = [...value];
    copia[index] = texto;
    onChange(copia);
  }

  function quitar(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function mover(index: number, direccion: -1 | 1) {
    const destino = index + direccion;
    if (destino < 0 || destino >= value.length) return;
    const copia = [...value];
    [copia[index], copia[destino]] = [copia[destino], copia[index]];
    onChange(copia);
  }

  const itemLabelCapitalizado = itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1);

  return (
    <div className="space-y-2">
      {value.map((texto, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={texto}
            onChange={(e) => actualizar(index, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={`${itemLabelCapitalizado} ${index + 1}`}
          />
          <div className="flex shrink-0 gap-1">
            <Button type="button" variant="ghost" size="icon" onClick={() => mover(index, -1)} disabled={disabled || index === 0} aria-label={`Mover ${itemLabel} ${index + 1} hacia arriba`}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => mover(index, 1)} disabled={disabled || index === value.length - 1} aria-label={`Mover ${itemLabel} ${index + 1} hacia abajo`}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => quitar(index)} disabled={disabled} aria-label={`Quitar ${itemLabel} ${index + 1}`}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, ""])} disabled={disabled}>
        <Plus className="h-4 w-4" />
        Agregar {itemLabel}
      </Button>
    </div>
  );
}
