import type { Experiencia } from "@/types/api";
import type { ExperienciaFormValues } from "@/features/experiencia/experiencia-schema";

/** Traduce el detalle (camelCase, ExperienciaResource) a los valores del formulario (snake_case, espejo del Form Request). */
export function experienciaToFormValues(e: Experiencia): ExperienciaFormValues {
  return {
    organizacion_id: e.organizacion?.id ?? 0,
    rol: e.rol,
    modalidad: e.modalidad,
    fecha_inicio: e.fechaInicio,
    fecha_fin: e.fechaFin,
    actual: e.actual,
    resumen: e.resumen,
    descripcion: e.descripcion,
    ubicacion: e.ubicacion,
    destacado: e.destacado,
    orden: e.orden,
    visible: e.visible,
    tecnologia_ids: e.tecnologias.map((t) => t.id),
    proyecto_ids: e.proyectos.map((p) => p.id),
    logros: e.logros.map((l) => l.texto),
  };
}
