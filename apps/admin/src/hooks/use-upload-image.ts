import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MediaItem } from "@/types/api";

/** Mutación de subida de imagen - un solo lugar, reutilizado por ImageUploader y GalleryUploader. */
export function useUploadImage() {
  return useMutation({
    mutationFn: async ({ archivo, altText }: { archivo: File; altText?: string }) => {
      const formData = new FormData();
      formData.append("archivo", archivo);
      if (altText) formData.append("alt_text", altText);
      return api.upload<{ data: MediaItem }>("/api/admin/media", formData);
    },
  });
}
