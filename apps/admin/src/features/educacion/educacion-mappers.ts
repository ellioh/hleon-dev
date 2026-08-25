import type { Educacion } from "@/types/api";
import type { EducacionFormValues } from "@/features/educacion/educacion-schema";

export function educacionToFormValues(e: Educacion): EducacionFormValues {
  return {
    institucion: e.institucion,
    titulo: e.titulo,
    titulo_en: e.tituloEn,
    campo_estudio: e.campoEstudio,
    fecha_inicio: e.fechaInicio,
    fecha_fin: e.fechaFin,
    en_curso: e.enCurso,
    descripcion: e.descripcion,
    visible: e.visible,
    orden: e.orden,
  };
}
