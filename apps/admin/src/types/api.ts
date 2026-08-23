/** Formas que reflejan los API Resources de Laravel (camelCase, ver ProyectoResource). */

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "editor";
  activo: boolean;
}

export interface MediaItem {
  id: number;
  url: string;
  tipo: "imagen" | "pdf" | "video_embed";
  altText: string | null;
  ancho: number | null;
  alto: number | null;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

export interface Organizacion {
  id: number;
  nombre: string;
  logo?: MediaItem | null;
  url: string | null;
}

export interface Tecnologia {
  id: number;
  nombre: string;
  slug: string;
  categoria: string;
  icono: string | null;
  logo?: MediaItem | null;
  colorAcento: string | null;
}

export interface SeoData {
  metaTitulo: string | null;
  metaDescripcion: string | null;
  canonicalUrl: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitulo: string | null;
  ogDescripcion: string | null;
  ogImagen: MediaItem | null;
  ogTipo: string;
  twitterCard: "summary" | "summary_large_image";
  twitterTitulo: string | null;
  twitterDescripcion: string | null;
  twitterImagen: MediaItem | null;
}

export type EstadoProyecto = "en_curso" | "completado" | "mantenimiento" | "archivado";
export type Modalidad = "remoto" | "presencial" | "hibrido";
export type EstadoPublicacion = "borrador" | "publicado";

export interface ProyectoResultado {
  id: number;
  metrica: string;
  valor: string;
  descripcion: string | null;
  orden: number;
}

export interface ProyectoVideo {
  id: number;
  url: string;
  titulo: string | null;
  orden: number;
}

/** Forma "tarjeta" - la que devuelve el listado (ProyectoSummaryResource). */
export interface ProyectoSummary {
  id: number;
  nombre: string;
  slug: string;
  resumenEjecutivo: string;
  categoria: Categoria | null;
  organizacion: Organizacion | null;
  imagenPrincipal: MediaItem | null;
  urlPublica: string | null;
  tecnologias: Tecnologia[];
  estado: EstadoProyecto;
  modalidad: Modalidad | null;
  destacado: boolean;
  visible: boolean;
  estadoPublicacion: EstadoPublicacion;
  esConfidencial: boolean;
  fechaInicio: string | null;
  orden: number;
  eliminadoEn: string | null;
}

/** Forma "detalle" completa (ProyectoResource). */
export interface Proyecto extends Omit<ProyectoSummary, "tecnologias"> {
  fechaFin: string | null;
  elDesafio: string;
  laSolucion: string;
  miRol: string;
  arquitectura: string | null;
  retos: string | null;
  aprendizajes: string | null;
  galeria: MediaItem[];
  videos: ProyectoVideo[];
  resultados: ProyectoResultado[];
  tecnologias: Tecnologia[];
  seo: SeoData | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
