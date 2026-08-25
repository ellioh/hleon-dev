import { z } from "zod";
import { seoSchema, seoValoresVacios } from "@/lib/seo-schema";

/**
 * Espejo de Store/UpdateServicioRequest de Laravel. Las reglas de rango
 * de precio (max >= min, moneda requerida si hay precio) NO se duplican
 * aquí a propósito, mismo criterio que en proyecto-schema.ts - viven una
 * sola vez en el backend y se muestran como el error 422 real.
 */
export const servicioSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  slug: z
    .string()
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa minúsculas, números y guiones")
    .optional()
    .or(z.literal("")),
  icono_emoji: z.string().max(10).nullable(),
  resumen_breve: z.string().trim().min(1, "El resumen breve es obligatorio").max(150),
  descripcion_completa: z.string().trim().min(1, "La descripción completa es obligatoria"),
  rango_precio_min: z.number().nullable(),
  rango_precio_max: z.number().nullable(),
  moneda: z.enum(["USD", "PEN"]).nullable(),
  tiempo_estimado: z.string().max(60).nullable(),
  proyecto_ejemplo_id: z.number().nullable(),
  categoria_id: z.number({ required_error: "Selecciona una categoría" }).min(1, "Selecciona una categoría"),
  visible: z.boolean(),
  destacado: z.boolean(),
  orden: z.number(),
  entregables: z.array(z.string()),
  seo: seoSchema,
});

export type ServicioFormValues = z.infer<typeof servicioSchema>;

export const valoresVacios: ServicioFormValues = {
  nombre: "",
  slug: "",
  icono_emoji: null,
  resumen_breve: "",
  descripcion_completa: "",
  rango_precio_min: null,
  rango_precio_max: null,
  moneda: null,
  tiempo_estimado: null,
  proyecto_ejemplo_id: null,
  categoria_id: 0,
  visible: true,
  destacado: false,
  orden: 0,
  entregables: [],
  seo: seoValoresVacios,
};
