import * as React from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUploadImage } from "@/hooks/use-upload-image";
import { ApiError } from "@/lib/api";
import type { MediaItem } from "@/types/api";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: MediaItem | null;
  onChange: (media: MediaItem | null) => void;
  label: string;
  disabled?: boolean;
}

/**
 * Subida de una sola imagen (p.ej. imagen principal) - reutilizable por
 * cualquier módulo con una imagen de portada. Ver GalleryUploader para
 * el caso 1-N ordenado.
 */
export function ImageUploader({ value, onChange, label, disabled }: ImageUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const upload = useUploadImage();

  async function subir(archivo: File) {
    try {
      const media = await upload.mutateAsync({ archivo });
      onChange(media.data);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo subir la imagen.");
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const archivo = e.dataTransfer.files?.[0];
    if (archivo) void subir(archivo);
  }

  if (value) {
    return (
      <div className="relative w-fit">
        <img src={value.url} alt={value.altText ?? ""} className="h-40 w-auto rounded-md border border-border object-cover" />
        {!disabled && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-ring"
            aria-label={`Quitar ${label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        "flex h-40 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input text-center transition-colors",
        dragOver && "border-primary bg-accent",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {upload.isPending ? (
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
      ) : (
        <ImagePlus className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      )}
      <p className="px-4 text-xs text-muted-foreground">Arrastra una imagen o</p>
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={upload.isPending}>
        Elegir archivo
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        aria-label={label}
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          if (archivo) void subir(archivo);
          e.target.value = "";
        }}
      />
    </div>
  );
}
