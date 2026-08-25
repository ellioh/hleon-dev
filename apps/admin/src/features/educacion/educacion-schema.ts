import { z } from "zod";

/**
 * Espejo de Store/UpdateEducacionRequest de Laravel. La regla
 * "en_curso no puede tener fecha_fin" NO se duplica aquí a propósito,
 * mismo criterio que el resto del proyecto - vive una sola vez en el
 * backend (EducacionService) y se muestra como el error 422 real.
 *
 * `titulo_en` es el único campo traducido: alimenta /hire-me y solo se
 * muestra ahí si tiene contenido (ver ADR de Educación/hire-me).
 */
export const educacionSchema = z.object({
  institucion: z.string().trim().min(1, "La institución es obligatoria").max(160),
  titulo: z.string().trim().min(1, "El título es obligatorio").max(160),
  titulo_en: z.string().max(160).nullable(),
  campo_estudio: z.string().max(120).nullable(),
  fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fecha_fin: z.string().nullable(),
  en_curso: z.boolean(),
  descripcion: z.string().nullable(),
  visible: z.boolean(),
  orden: z.number(),
});

export type EducacionFormValues = z.infer<typeof educacionSchema>;

export const valoresVacios: EducacionFormValues = {
  institucion: "",
  titulo: "",
  titulo_en: null,
  campo_estudio: null,
  fecha_inicio: "",
  fecha_fin: null,
  en_curso: false,
  descripcion: null,
  visible: true,
  orden: 0,
};
