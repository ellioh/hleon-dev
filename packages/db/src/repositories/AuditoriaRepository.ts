import type { AccionAuditoria, RegistroAuditoria } from "@hleon/types";
import { execute, query } from "../client.js";

/**
 * Bitácora de solo lectura desde el backoffice: solo expone `registrar` y
 * consultas, nunca `update`/`delete` - por eso no extiende BaseRepository
 * (que sí los expone) y define su propio contrato reducido a propósito.
 */
export class AuditoriaRepository {
  async registrar(entrada: {
    modulo: string;
    entidadId: number;
    accion: AccionAuditoria;
    usuarioId: number;
    cambios?: Record<string, { antes: unknown; despues: unknown }>;
  }): Promise<void> {
    await execute(
      `INSERT INTO auditoria (modulo, entidad_id, accion, usuario_id, cambios) VALUES (?, ?, ?, ?, ?)`,
      [
        entrada.modulo,
        entrada.entidadId,
        entrada.accion,
        entrada.usuarioId,
        entrada.cambios ? JSON.stringify(entrada.cambios) : null,
      ]
    );
  }

  async findByModulo(modulo: string, entidadId?: number): Promise<RegistroAuditoria[]> {
    const conditions = ["modulo = ?"];
    const params: (string | number)[] = [modulo];
    if (entidadId !== undefined) {
      conditions.push("entidad_id = ?");
      params.push(entidadId);
    }

    return query<RegistroAuditoria>(
      `SELECT id, modulo, entidad_id AS entidadId, accion, usuario_id AS usuarioId, cambios, fecha
       FROM auditoria WHERE ${conditions.join(" AND ")} ORDER BY fecha DESC`,
      params
    );
  }

  async findRecientes(limit = 20): Promise<RegistroAuditoria[]> {
    return query<RegistroAuditoria>(
      `SELECT id, modulo, entidad_id AS entidadId, accion, usuario_id AS usuarioId, cambios, fecha
       FROM auditoria ORDER BY fecha DESC LIMIT ${Number(limit)}`
    );
  }
}

export const auditoriaRepository = new AuditoriaRepository();
