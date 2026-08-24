import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LogrosEditorProps {
  value: string[];
  onChange: (logros: string[]) => void;
  disabled?: boolean;
}

/**
 * Lista ordenada de logros (texto libre) - reordenamiento por botones,
 * mismo patrón que GalleryUploader. Local a Experiencia: si otro módulo
 * necesita el mismo patrón de "lista de texto libre ordenable"
 * (ProyectoResultado no tiene UI de escritura todavía, ver ADR 0007),
 * promoverlo a components/shared/ en ese momento.
 */
export function LogrosEditor({ value, onChange, disabled }: LogrosEditorProps) {
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

  return (
    <div className="space-y-2">
      {value.map((texto, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={texto}
            onChange={(e) => actualizar(index, e.target.value)}
            placeholder="Ej: Reduje el tiempo de cierre contable de 5 a 2 días"
            disabled={disabled}
            aria-label={`Logro ${index + 1}`}
          />
          <div className="flex shrink-0 gap-1">
            <Button type="button" variant="ghost" size="icon" onClick={() => mover(index, -1)} disabled={disabled || index === 0} aria-label={`Mover logro ${index + 1} hacia arriba`}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => mover(index, 1)} disabled={disabled || index === value.length - 1} aria-label={`Mover logro ${index + 1} hacia abajo`}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => quitar(index)} disabled={disabled} aria-label={`Quitar logro ${index + 1}`}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, ""])} disabled={disabled}>
        <Plus className="h-4 w-4" />
        Agregar logro
      </Button>
    </div>
  );
}
