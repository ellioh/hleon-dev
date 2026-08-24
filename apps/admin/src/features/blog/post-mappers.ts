import type { Post } from "@/types/api";
import { type PostFormValues, valoresVacios } from "@/features/blog/post-schema";

/** Traduce el detalle (camelCase, PostResource) a los valores del formulario (snake_case, espejo del Form Request). */
export function postToFormValues(p: Post): PostFormValues {
  return {
    titulo: p.titulo,
    slug: p.slug,
    resumen: p.resumen,
    contenido: p.contenido,
    categoria_id: p.categoria?.id ?? 0,
    tipo_audiencia: p.tipoAudiencia,
    tags: p.tags,
    imagen_destacada_id: p.imagenDestacada?.id ?? null,
    fecha_publicacion: p.fechaPublicacion,
    seo: p.seo ?? valoresVacios.seo,
  };
}
