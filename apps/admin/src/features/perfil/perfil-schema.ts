import { z } from "zod";

/** Espejo de PerfilRequest de Laravel - un solo formulario, siempre envía todos los campos (sin sometimes). */
export const perfilSchema = z.object({
  nombre_completo: z.string().trim().min(1, "El nombre completo es obligatorio").max(160),
  nombre_publico: z.string().max(160).nullable(),
  titulo_profesional: z.string().trim().min(1, "El título profesional es obligatorio").max(160),
  titulo_profesional_en: z.string().max(160).nullable(),
  bio_corta: z.string().trim().min(1, "La bio corta es obligatoria").max(200),
  bio_larga: z.string().trim().min(1, "La bio larga es obligatoria"),
  bio_larga_en: z.string().nullable(),
  foto_media_id: z.number().nullable(),
  email: z.string().trim().min(1, "El email es obligatorio").email("Email no válido").max(190),
  ubicacion: z.string().trim().min(1, "La ubicación es obligatoria").max(120),
  nivel_ingles: z.enum(["basico", "intermedio", "avanzado", "profesional", "nativo"]),
  disponibilidad: z.enum(["abierto_remoto", "abierto_proyectos", "abierto_ambos", "no_disponible"]),
  mensaje_disponibilidad: z.string().max(200).nullable(),
  anos_experiencia: z.number().min(0),
});

export type PerfilFormValues = z.infer<typeof perfilSchema>;

export const valoresVacios: PerfilFormValues = {
  nombre_completo: "",
  nombre_publico: null,
  titulo_profesional: "",
  titulo_profesional_en: null,
  bio_corta: "",
  bio_larga: "",
  bio_larga_en: null,
  foto_media_id: null,
  email: "",
  ubicacion: "",
  nivel_ingles: "avanzado",
  disponibilidad: "abierto_ambos",
  mensaje_disponibilidad: null,
  anos_experiencia: 0,
};
