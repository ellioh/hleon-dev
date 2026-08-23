export type TipoCategoria = "blog" | "proyecto" | "servicio" | "ambos";

/**
 * Taxonomía única compartida por Blog, Proyectos y Servicios. Reemplaza
 * las dos listas de categoría divergentes del sistema anterior basado en
 * JSON (hallazgo de la auditoría técnica).
 */
export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  tipo: TipoCategoria;
  descripcion: string | null;
  orden: number;
}

export type TipoAudiencia = "consultoria" | "carrera_arquitectura" | "ambos";

export interface Post {
  id: number;
  titulo: string;
  slug: string;
  resumen: string;
  contenido: string;
  categoriaId: number;
  /** Determina el CTA dinámico definido en la estrategia de contenido. */
  tipoAudiencia: TipoAudiencia;
  tags: string[];
  metaDescripcion: string;
  imagenDestacadaId: number | null;
  autorId: number;
  publicado: boolean;
  fechaPublicacion: string;
  fechaActualizacion: string;
  creadoEn: string;
  eliminadoEn: string | null;
}

/**
 * `publicado=true` requiere `consentimientoVerificado=true` (regla de
 * negocio aplicada en TestimonioService y reforzada con un CHECK en la
 * base de datos - corrige el hallazgo de la auditoría sobre testimonios
 * no verificables).
 */
export interface Testimonio {
  id: number;
  nombreCliente: string;
  rolCliente: string;
  clienteId: number | null;
  texto: string;
  calificacion: number | null;
  proyectoId: number | null;
  consentimientoVerificado: boolean;
  publicado: boolean;
  destacado: boolean;
  orden: number;
  fechaRecibido: string | null;
  creadoEn: string;
  eliminadoEn: string | null;
}

export type SeccionFaq = "servicios" | "general" | "proceso" | "reclutamiento";

export interface Faq {
  id: number;
  pregunta: string;
  respuesta: string;
  seccion: SeccionFaq;
  visible: boolean;
  orden: number;
}
