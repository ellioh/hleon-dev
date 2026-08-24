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

export type NivelIngles = "basico" | "intermedio" | "avanzado" | "profesional" | "nativo";
export type Disponibilidad = "abierto_remoto" | "abierto_proyectos" | "abierto_ambos" | "no_disponible";

/** Singleton - GET /api/admin/perfil devuelve `{data: null}` hasta que se guarde la primera vez. */
export interface Perfil {
  id: number;
  nombreCompleto: string;
  nombrePublico: string | null;
  tituloProfesional: string;
  bioCorta: string;
  bioLarga: string;
  foto: MediaItem | null;
  email: string;
  ubicacion: string;
  nivelIngles: NivelIngles;
  disponibilidad: Disponibilidad;
  mensajeDisponibilidad: string | null;
  anosExperiencia: number;
  cvGeneralId: number | null;
  actualizadoEn: string;
}

export interface Autor {
  nombre: string;
  tituloProfesional: string;
  foto: MediaItem | null;
}

export type TipoAudiencia = "consultoria" | "carrera_arquitectura" | "ambos";

/** Forma "tarjeta" - la que devuelve el listado (PostSummaryResource). */
export interface PostSummary {
  id: number;
  titulo: string;
  slug: string;
  resumen: string;
  categoria: Categoria | null;
  autor: Autor | null;
  tipoAudiencia: TipoAudiencia;
  tags: string[];
  imagenDestacada: MediaItem | null;
  publicado: boolean;
  fechaPublicacion: string | null;
  eliminadoEn: string | null;
}

/** Forma "detalle" completa (PostResource). */
export interface Post extends PostSummary {
  contenido: string;
  seo: SeoData | null;
  fechaActualizacion: string;
  creadoEn: string;
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
