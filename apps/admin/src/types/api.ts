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

export type TipoOrganizacion = "cliente" | "empleador" | "ambos";

/** Forma de GET/POST /api/admin/organizaciones - distinta de `Organizacion` (que es la lectura pública, ya enmascarada). */
export interface OrganizacionAdmin {
  id: number;
  nombre: string;
  tipo: TipoOrganizacion;
  rubro: string | null;
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

export type ModalidadExperiencia = "remoto" | "presencial" | "hibrido" | "freelance";

export interface ExperienciaLogro {
  id: number;
  texto: string;
  orden: number;
}

/** Forma única (ExperienciaResource) - sin split lista/detalle, ver ADR 0007. */
export interface Experiencia {
  id: number;
  organizacion: Organizacion | null;
  rol: string;
  modalidad: ModalidadExperiencia;
  fechaInicio: string;
  fechaFin: string | null;
  actual: boolean;
  resumen: string;
  descripcion: string;
  ubicacion: string | null;
  logros: ExperienciaLogro[];
  tecnologias: Tecnologia[];
  proyectos: ProyectoSummary[];
  destacado: boolean;
  orden: number;
  visible: boolean;
  estadoPublicacion: EstadoPublicacion;
  creadoEn: string;
  actualizadoEn: string;
  eliminadoEn: string | null;
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
