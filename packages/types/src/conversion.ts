import type { Modalidad } from "./comunes.js";

export type MotivoSolicitud = "proyecto" | "empleo" | "otro";
export type EstadoSolicitud = "nuevo" | "leido" | "respondido" | "archivado";

/**
 * Lead del formulario de contacto, bifurcado por `motivo`. Los campos
 * específicos de cada motivo quedan opcionales a nivel de tipo; la
 * validación condicional real vive en SolicitudService.
 */
export interface Solicitud {
  id: number;
  motivo: MotivoSolicitud;
  nombre: string;
  email: string;
  mensaje: string;
  // motivo = "proyecto"
  empresa: string | null;
  tipoSistemaId: number | null;
  presupuesto: string | null;
  // motivo = "empleo"
  empresaReclutadora: string | null;
  tipoRol: string | null;
  modalidad: Modalidad | null;
  rangoSalarial: string | null;
  urlVacante: string | null;
  // seguimiento
  estado: EstadoSolicitud;
  notasInternas: string | null;
  origen: string | null;
  fecha: string;
  eliminadoEn: string | null;
}

export type IdiomaDescarga = "es" | "en";

export interface Descarga {
  id: number;
  nombre: string;
  idioma: IdiomaDescarga;
  archivoMediaId: number;
  version: string;
  esPredeterminado: boolean;
  visible: boolean;
  descargasContador: number;
  creadoEn: string;
  actualizadoEn: string;
}
