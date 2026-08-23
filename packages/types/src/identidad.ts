import type { ConAuditoriaTemporal } from "./comunes.js";

export type NivelIngles = "basico" | "intermedio" | "avanzado" | "profesional" | "nativo";

export type Disponibilidad =
  | "abierto_remoto"
  | "abierto_proyectos"
  | "abierto_ambos"
  | "no_disponible";

/** Singleton - fuente única de identidad, contacto y disponibilidad. */
export interface Perfil extends ConAuditoriaTemporal {
  id: number;
  nombreCompleto: string;
  nombrePublico: string | null;
  tituloProfesional: string;
  bioCorta: string;
  bioLarga: string;
  fotoMediaId: number | null;
  email: string;
  ubicacion: string;
  nivelIngles: NivelIngles;
  disponibilidad: Disponibilidad;
  mensajeDisponibilidad: string | null;
  anosExperiencia: number;
  cvGeneralId: number | null;
}

export interface HeroEstadistica {
  id: number;
  heroId: number;
  numero: string;
  etiqueta: string;
  orden: number;
}

/** Singleton - mensaje y fork del home. */
export interface Hero extends ConAuditoriaTemporal {
  id: number;
  headline: string;
  subheadline: string;
  forkEmpresaTitulo: string;
  forkEmpresaDescripcion: string;
  forkEmpresaCtaLabel: string;
  forkEmpresaCtaUrl: string;
  forkReclutadorTitulo: string;
  forkReclutadorDescripcion: string;
  forkReclutadorCtaLabel: string;
  forkReclutadorCtaUrl: string;
  ctaFinalTitulo: string | null;
  ctaFinalDescripcion: string | null;
  estadisticas?: HeroEstadistica[];
}

export type ContextoEnlace = "social" | "nav_principal" | "footer";

export interface Enlace {
  id: number;
  etiqueta: string;
  url: string;
  contexto: ContextoEnlace;
  orden: number;
  visible: boolean;
  abreNuevaPestana: boolean;
}
