import { z } from "zod";

/**
 * Espejo de Store/UpdateCertificacionRequest de Laravel. La regla
 * "fecha_expiracion posterior a fecha_obtencion" NO se duplica aquí a
 * propósito, mismo criterio que el resto del proyecto - vive una sola
 * vez en el backend y se muestra como el error 422 real.
 */
export const certificacionSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(160),
  emisor: z.string().trim().min(1, "El emisor es obligatorio").max(120),
  fecha_obtencion: z.string().min(1, "La fecha de obtención es obligatoria"),
  fecha_expiracion: z.string().nullable(),
  credencial_id: z.string().max(120).nullable(),
  url_verificacion: z.union([z.literal(""), z.string().trim().url("URL no válida")]).nullable(),
  imagen_insignia_id: z.number().nullable(),
  destacado: z.boolean(),
  visible: z.boolean(),
  orden: z.number(),
});

export type CertificacionFormValues = z.infer<typeof certificacionSchema>;

export const valoresVacios: CertificacionFormValues = {
  nombre: "",
  emisor: "",
  fecha_obtencion: "",
  fecha_expiracion: null,
  credencial_id: null,
  url_verificacion: null,
  imagen_insignia_id: null,
  destacado: false,
  visible: true,
  orden: 0,
};
