import { z } from "zod";
import { seoSchema, seoValoresVacios } from "@/lib/seo-schema";

/**
 * Espejo de Store/UpdatePostRequest de Laravel. Sin `autor_id` a
 * propósito: se resuelve del lado del servidor a partir del Perfil
 * singleton (ver PostService::crear) - el formulario nunca lo pide. Sin
 * `publicado` tampoco: se maneja exclusivamente vía las acciones
 * publicar/despublicar del listado, igual que estado_publicacion en
 * Proyecto/Experiencia.
 */
export const postSchema = z.object({
  titulo: z.string().trim().min(1, "El título es obligatorio").max(180),
  slug: z
    .string()
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa minúsculas, números y guiones")
    .optional()
    .or(z.literal("")),
  resumen: z.string().trim().min(1, "El resumen es obligatorio").max(300),
  contenido: z.string().trim().min(1, "El contenido es obligatorio"),
  categoria_id: z.number({ required_error: "Selecciona una categoría" }).min(1, "Selecciona una categoría"),
  tipo_audiencia: z.enum(["consultoria", "carrera_arquitectura", "ambos"]),
  tags: z.array(z.string()),
  imagen_destacada_id: z.number().nullable(),
  fecha_publicacion: z.string().nullable(),
  seo: seoSchema,
});

export type PostFormValues = z.infer<typeof postSchema>;

export const valoresVacios: PostFormValues = {
  titulo: "",
  slug: "",
  resumen: "",
  contenido: "",
  categoria_id: 0,
  tipo_audiencia: "ambos",
  tags: [],
  imagen_destacada_id: null,
  fecha_publicacion: null,
  seo: seoValoresVacios,
};
