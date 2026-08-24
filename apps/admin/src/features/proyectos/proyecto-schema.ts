import { z } from "zod";
import { seoSchema, seoValoresVacios } from "@/lib/seo-schema";

/**
 * Espejo de StoreProyectoRequest/UpdateProyectoRequest de Laravel.
 * nombre/resumen_ejecutivo/categoria_id/tecnologia_ids son obligatorios
 * siempre (igual que en el backend); el_desafio/la_solucion/mi_rol NO se
 * exigen aquí a propósito - esa regla ("no se puede publicar sin
 * narrativa") ya vive en ProyectoService y se muestra como el error 422
 * real del servidor al intentar publicar, para no duplicar la regla de
 * negocio en dos lugares que puedan desincronizarse.
 */
export const proyectoSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(160),
  slug: z
    .string()
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa minúsculas, números y guiones")
    .optional()
    .or(z.literal("")),
  resumen_ejecutivo: z.string().trim().min(1, "El resumen ejecutivo es obligatorio").max(220),
  organizacion_id: z.number().nullable(),
  es_confidencial: z.boolean(),
  categoria_id: z.number({ required_error: "Selecciona una categoría" }).min(1, "Selecciona una categoría"),
  estado: z.enum(["en_curso", "completado", "mantenimiento", "archivado"]),
  modalidad: z.enum(["remoto", "presencial", "hibrido"]).nullable(),
  fecha_inicio: z.string().nullable(),
  fecha_fin: z.string().nullable(),
  el_desafio: z.string(),
  la_solucion: z.string(),
  mi_rol: z.string(),
  arquitectura: z.string().nullable(),
  retos: z.string().nullable(),
  aprendizajes: z.string().nullable(),
  imagen_principal_id: z.number().nullable(),
  url_publica: z.union([z.literal(""), z.string().trim().url("URL no válida")]).nullable(),
  destacado: z.boolean(),
  orden: z.number(),
  visible: z.boolean(),
  tecnologia_ids: z.array(z.number()).min(1, "Selecciona al menos una tecnología"),
  seo: seoSchema,
});

export type ProyectoFormValues = z.infer<typeof proyectoSchema>;

export const valoresVacios: ProyectoFormValues = {
  nombre: "",
  slug: "",
  resumen_ejecutivo: "",
  organizacion_id: null,
  es_confidencial: false,
  categoria_id: 0,
  estado: "en_curso",
  modalidad: null,
  fecha_inicio: null,
  fecha_fin: null,
  el_desafio: "",
  la_solucion: "",
  mi_rol: "",
  arquitectura: null,
  retos: null,
  aprendizajes: null,
  imagen_principal_id: null,
  url_publica: null,
  destacado: false,
  orden: 0,
  visible: true,
  tecnologia_ids: [],
  seo: seoValoresVacios,
};
