import type { Servicio } from "@/types/api";
import { type ServicioFormValues, valoresVacios } from "@/features/servicios/servicio-schema";

/** Traduce el detalle (camelCase, ServicioResource) a los valores del formulario (snake_case, espejo del Form Request). */
export function servicioToFormValues(s: Servicio): ServicioFormValues {
  return {
    nombre: s.nombre,
    slug: s.slug,
    icono_emoji: s.iconoEmoji,
    resumen_breve: s.resumenBreve,
    descripcion_completa: s.descripcionCompleta,
    rango_precio_min: s.rangoPrecioMin !== null ? Number(s.rangoPrecioMin) : null,
    rango_precio_max: s.rangoPrecioMax !== null ? Number(s.rangoPrecioMax) : null,
    moneda: s.moneda,
    tiempo_estimado: s.tiempoEstimado,
    proyecto_ejemplo_id: s.proyectoEjemplo?.id ?? null,
    categoria_id: s.categoria?.id ?? 0,
    visible: s.visible,
    destacado: s.destacado,
    orden: s.orden,
    entregables: s.entregables.map((e) => e.texto),
    seo: s.seo ?? valoresVacios.seo,
  };
}
