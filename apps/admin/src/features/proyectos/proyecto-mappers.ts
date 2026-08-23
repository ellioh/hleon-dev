import type { Proyecto } from "@/types/api";
import { type ProyectoFormValues, valoresVacios } from "@/features/proyectos/proyecto-schema";

/** Traduce el detalle (camelCase, ProyectoResource) a los valores del formulario (snake_case, espejo del Form Request). */
export function proyectoToFormValues(p: Proyecto): ProyectoFormValues {
  return {
    nombre: p.nombre,
    slug: p.slug,
    resumen_ejecutivo: p.resumenEjecutivo,
    organizacion_id: p.organizacion?.id ?? null,
    es_confidencial: p.esConfidencial,
    categoria_id: p.categoria?.id ?? 0,
    estado: p.estado,
    modalidad: p.modalidad,
    fecha_inicio: p.fechaInicio,
    fecha_fin: p.fechaFin,
    el_desafio: p.elDesafio,
    la_solucion: p.laSolucion,
    mi_rol: p.miRol,
    arquitectura: p.arquitectura,
    retos: p.retos,
    aprendizajes: p.aprendizajes,
    imagen_principal_id: p.imagenPrincipal?.id ?? null,
    url_publica: p.urlPublica,
    destacado: p.destacado,
    orden: p.orden,
    visible: p.visible,
    tecnologia_ids: p.tecnologias.map((t) => t.id),
    seo: p.seo ?? valoresVacios.seo,
  };
}
