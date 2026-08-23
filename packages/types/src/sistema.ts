export type RolUsuario = "admin" | "editor";

/**
 * Hoy solo existe un administrador, pero se modela con rol desde el
 * inicio para no requerir una migración de auth cuando se necesite un
 * segundo usuario o el futuro panel de clientes.
 */
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  /** Nunca se expone fuera del repositorio de auth. */
  passwordHash: string;
  rol: RolUsuario;
  activo: boolean;
  ultimoAcceso: string | null;
  creadoEn: string;
}

export type AccionAuditoria = "crear" | "editar" | "eliminar" | "publicar" | "despublicar";

/** Bitácora de solo lectura desde el backoffice. */
export interface RegistroAuditoria {
  id: number;
  modulo: string;
  entidadId: number;
  accion: AccionAuditoria;
  usuarioId: number;
  cambios: Record<string, { antes: unknown; despues: unknown }> | null;
  fecha: string;
}

export type TipoMedia = "imagen" | "pdf" | "video_embed";

export interface Media {
  id: number;
  url: string;
  tipo: TipoMedia;
  altText: string | null;
  tamanoBytes: number | null;
  ancho: number | null;
  alto: number | null;
  subidoPor: number | null;
  subidoEn: string;
}

export interface Configuracion {
  id: number;
  nombreSitio: string;
  tituloTemplate: string;
  descripcionDefault: string;
  imagenOgDefaultId: number | null;
  dominioBase: string;
  analyticsId: string | null;
  googleSearchConsole: string | null;
  textosLegales: string | null;
  featureFlags: Record<string, boolean> | null;
  creadoEn: string;
  actualizadoEn: string;
}
