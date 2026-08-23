import type { ConAuditoriaTemporal, ConSoftDelete, EstadoPublicacion, Modalidad } from "./comunes.js";

export interface ExperienciaLogro {
  id: number;
  experienciaId: number;
  texto: string;
  orden: number;
}

/** Línea de tiempo laboral. Insumo principal de /trayectoria y /hire-me. */
export interface Experiencia extends ConAuditoriaTemporal, ConSoftDelete {
  id: number;
  empresa: string;
  rol: string;
  modalidad: Modalidad;
  fechaInicio: string;
  fechaFin: string | null;
  actual: boolean;
  resumen: string;
  descripcion: string;
  ubicacion: string | null;
  destacado: boolean;
  visible: boolean;
  orden: number;
  estadoPublicacion: EstadoPublicacion;
  logros?: ExperienciaLogro[];
  tecnologiaIds?: number[];
  proyectoIds?: number[];
}

export interface Educacion extends ConSoftDelete {
  id: number;
  institucion: string;
  titulo: string;
  campoEstudio: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  enCurso: boolean;
  descripcion: string | null;
  visible: boolean;
  orden: number;
  creadoEn: string;
}

export interface Certificacion extends ConSoftDelete {
  id: number;
  nombre: string;
  emisor: string;
  fechaObtencion: string;
  fechaExpiracion: string | null;
  credencialId: string | null;
  urlVerificacion: string | null;
  imagenInsigniaId: number | null;
  destacado: boolean;
  visible: boolean;
  orden: number;
  creadoEn: string;
}

export type CategoriaHabilidad =
  | "analisis_arquitectura"
  | "liderazgo_comunicacion"
  | "backend"
  | "frontend"
  | "datos"
  | "herramientas"
  | "idiomas";

/**
 * Competencia de analista - responde "qué sabes analizar/liderar",
 * deliberadamente distinto de Tecnologia ("con qué construyes").
 * `nivelInterno` solo ordena internamente; nunca se renderiza como
 * barra de progreso pública (falsa precisión).
 */
export interface Habilidad {
  id: number;
  nombre: string;
  categoria: CategoriaHabilidad;
  descripcionBreve: string | null;
  nivelInterno: number | null;
  destacada: boolean;
  orden: number;
}
