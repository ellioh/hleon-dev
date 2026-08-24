import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TagsEditorProps {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

/**
 * Tags como texto libre (columna `tags` json, no una entidad propia como
 * Tecnologia - ver esquema de posts). Enter o coma agrega, click en la X
 * quita. Local a features/blog/ mientras sea el único consumidor.
 */
export function TagsEditor({ value, onChange, disabled }: TagsEditorProps) {
  const [borrador, setBorrador] = useState("");

  function agregar(texto: string) {
    const limpio = texto.trim().toLowerCase();
    if (!limpio || value.includes(limpio)) return;
    onChange([...value, limpio]);
  }

  function quitar(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      agregar(borrador);
      setBorrador("");
    } else if (e.key === "Backspace" && !borrador && value.length > 0) {
      quitar(value[value.length - 1]);
    }
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-live="polite">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => quitar(tag)}
                  className="rounded-full p-0.5 hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label={`Quitar tag ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
      <Input
        value={borrador}
        onChange={(e) => setBorrador(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          agregar(borrador);
          setBorrador("");
        }}
        placeholder="Escribe un tag y presiona Enter"
        disabled={disabled}
        aria-label="Agregar tag"
      />
    </div>
  );
}
