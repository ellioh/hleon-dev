import type { ConAuditoriaTemporal, ConSoftDelete, EstadoPublicacion, Modalidad } from "./comunes.js";

export type CategoriaTecnologia =
  | "backend"
  | "frontend"
  | "basededatos"
  | "infraestructura"
  | "lenguaje"
  | "herramienta"
  | "otro";

export interface Tecnologia {
  id: number;
  nombre: string;
  categoria: CategoriaTecnologia;
  icono: string | null;
  colorAcento: string | null;
  url: string | null;
  destacado: boolean;
  orden: number;
}

export interface Cliente {
  id: number;
  nombre: string;
  logoMediaId: number | null;
  url: string | null;
  rubro: string | null;
  destacado: boolean;
  orden: number;
}

export type EstadoProyecto = "en_curso" | "completado" | "mantenimiento" | "archivado";

export interface ProyectoResultado {
  id: number;
  proyectoId: number;
  metrica: string;
  valor: string;
  descripcion: string | null;
  orden: number;
}

export interface ProyectoVideo {
  id: number;
  proyectoId: number;
  url: string;
  titulo: string | null;
  orden: number;
}

/**
 * El case study completo. `elDesafio`/`laSolucion`/`miRol` son obligatorios
 * a propósito: el formulario enseña la estructura narrativa correcta,
 * no permite publicar un proyecto que "se olvidó" del resultado.
 * `esConfidencial` oculta cliente y cifras exactas en el frontend aunque
 * los datos existan en la fila (regla aplicada en ProyectoService).
 */
export interface Proyecto extends ConAuditoriaTemporal, ConSoftDelete {
  id: number;
  nombre: string;
  slug: string;
  resumenEjecutivo: string;
  clienteId: number | null;
  esConfidencial: boolean;
  categoriaId: number;
  estado: EstadoProyecto;
  modalidad: Modalidad;
  fechaInicio: string;
  fechaFin: string | null;
  elDesafio: string;
  laSolucion: string;
  miRol: string;
  arquitectura: string | null;
  retos: string | null;
  aprendizajes: string | null;
  imagenPrincipalId: number | null;
  destacado: boolean;
  orden: number;
  visible: boolean;
  estadoPublicacion: EstadoPublicacion;
  metaTitulo: string | null;
  metaDescripcion: string | null;
  resultados?: ProyectoResultado[];
  galeriaMediaIds?: number[];
  videos?: ProyectoVideo[];
  tecnologiaIds?: number[];
  proyectosRelacionadosIds?: number[];
}

export interface ServicioEntregable {
  id: number;
  servicioId: number;
  texto: string;
  orden: number;
}

export type Moneda = "USD" | "PEN";

export interface Servicio extends ConAuditoriaTemporal, ConSoftDelete {
  id: number;
  nombre: string;
  slug: string;
  iconoEmoji: string | null;
  resumenBreve: string;
  descripcionCompleta: string;
  rangoPrecioMin: number | null;
  rangoPrecioMax: number | null;
  moneda: Moneda | null;
  tiempoEstimado: string | null;
  proyectoEjemploId: number | null;
  categoriaId: number;
  visible: boolean;
  destacado: boolean;
  orden: number;
  entregablesTipicos?: ServicioEntregable[];
}
