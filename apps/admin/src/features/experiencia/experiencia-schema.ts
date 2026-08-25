import { z } from "zod";

/**
 * Espejo de Store/UpdateExperienciaRequest de Laravel. Igual que en
 * proyecto-schema.ts, la regla "actual no puede tener fecha_fin" NO se
 * duplica aquí a propósito - vive una sola vez en el backend
 * (ExperienciaService) y se muestra como el error 422 real del servidor.
 */
export const experienciaSchema = z.object({
  organizacion_id: z.number({ required_error: "Selecciona un empleador" }).min(1, "Selecciona un empleador"),
  rol: z.string().trim().min(1, "El rol es obligatorio").max(120),
  rol_en: z.string().max(120).nullable(),
  modalidad: z.enum(["remoto", "presencial", "hibrido", "freelance"]),
  fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fecha_fin: z.string().nullable(),
  actual: z.boolean(),
  resumen: z.string().trim().min(1, "El resumen es obligatorio").max(300),
  resumen_en: z.string().max(300).nullable(),
  descripcion: z.string(),
  ubicacion: z.string().nullable(),
  destacado: z.boolean(),
  orden: z.number(),
  visible: z.boolean(),
  tecnologia_ids: z.array(z.number()),
  proyecto_ids: z.array(z.number()),
  logros: z.array(z.string().trim().min(1).max(300)),
});

export type ExperienciaFormValues = z.infer<typeof experienciaSchema>;

export const valoresVacios: ExperienciaFormValues = {
  organizacion_id: 0,
  rol: "",
  rol_en: null,
  modalidad: "remoto",
  fecha_inicio: "",
  fecha_fin: null,
  actual: false,
  resumen: "",
  resumen_en: null,
  descripcion: "",
  ubicacion: null,
  destacado: false,
  orden: 0,
  visible: true,
  tecnologia_ids: [],
  proyecto_ids: [],
  logros: [],
};
