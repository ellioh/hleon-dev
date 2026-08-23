/** Tipos compartidos por múltiples entidades del dominio. */

export type EstadoPublicacion = "borrador" | "publicado";

export type Modalidad = "remoto" | "presencial" | "hibrido" | "freelance";

/** Toda entidad con soft delete expone `eliminadoEn`; null = activa. */
export interface ConSoftDelete {
  eliminadoEn: string | null;
}

export interface ConAuditoriaTemporal {
  creadoEn: string;
  actualizadoEn: string;
}
