import * as React from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUploadImage } from "@/hooks/use-upload-image";
import { ApiError } from "@/lib/api";
import type { MediaItem } from "@/types/api";

interface GalleryUploaderProps {
  value: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  disabled?: boolean;
}

/**
 * Galería ordenada 1-N - mismo patrón de subida que ImageUploader, con
 * reordenamiento por botones (no drag-and-drop: evita sumar una
 * dependencia solo para eso, y los botones son más accesibles por
 * teclado sin esfuerzo extra).
 */
export function GalleryUploader({ value, onChange, disabled }: GalleryUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const upload = useUploadImage();

  async function agregar(archivos: FileList) {
    for (const archivo of Array.from(archivos)) {
      try {
        const media = await upload.mutateAsync({ archivo });
        onChange([...value, media.data]);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : `No se pudo subir ${archivo.name}.`);
      }
    }
  }

  function quitar(id: number) {
    onChange(value.filter((m) => m.id !== id));
  }

  function mover(index: number, direccion: -1 | 1) {
    const destino = index + direccion;
    if (destino < 0 || destino >= value.length) return;
    const copia = [...value];
    [copia[index], copia[destino]] = [copia[destino], copia[index]];
    onChange(copia);
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-3" aria-label="Imágenes de la galería">
          {value.map((media, index) => (
            <li key={media.id} className="relative w-28">
              <img src={media.url} alt={media.altText ?? ""} className="h-20 w-28 rounded-md border border-border object-cover" />
              {!disabled && (
                <>
                  <button
                    type="button"
                    onClick={() => quitar(media.id)}
                    className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-1 text-destructive-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    aria-label={`Quitar imagen ${index + 1}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="mt-1 flex justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => mover(index, -1)}
                      disabled={index === 0}
                      className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-ring"
                      aria-label={`Mover imagen ${index + 1} hacia atrás`}
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => mover(index, 1)}
                      disabled={index === value.length - 1}
                      className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-ring"
                      aria-label={`Mover imagen ${index + 1} hacia adelante`}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={disabled || upload.isPending}>
        {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        Agregar imágenes
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="sr-only"
        aria-label="Agregar imágenes a la galería"
        onChange={(e) => {
          if (e.target.files?.length) void agregar(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
