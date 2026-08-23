import type { Perfil } from "@hleon/types";
import { execute, query } from "../client.js";

const COLUMNS = `
  id, nombre_completo AS nombreCompleto, nombre_publico AS nombrePublico,
  titulo_profesional AS tituloProfesional, bio_corta AS bioCorta, bio_larga AS bioLarga,
  foto_media_id AS fotoMediaId, email, ubicacion, nivel_ingles AS nivelIngles,
  disponibilidad, mensaje_disponibilidad AS mensajeDisponibilidad,
  anos_experiencia AS anosExperiencia, cv_general_id AS cvGeneralId,
  creado_en AS creadoEn, actualizado_en AS actualizadoEn
`;

/**
 * Singleton: existe 0 o 1 fila. `get()` devuelve null si Perfil todavía
 * no fue completado - el CMS y el frontend deben tratar eso como
 * "contenido pendiente", nunca inventar un valor por defecto.
 */
export class PerfilRepository {
  async get(): Promise<Perfil | null> {
    const rows = await query<Perfil>(`SELECT ${COLUMNS} FROM perfil ORDER BY id LIMIT 1`);
    return rows[0] ?? null;
  }

  /** Crea la fila única si no existe, o actualiza la existente. */
  async upsert(data: Omit<Perfil, "id" | "creadoEn" | "actualizadoEn">): Promise<Perfil> {
    const existente = await this.get();

    if (!existente) {
      await execute(
        `INSERT INTO perfil (
          nombre_completo, nombre_publico, titulo_profesional, bio_corta, bio_larga,
          foto_media_id, email, ubicacion, nivel_ingles, disponibilidad,
          mensaje_disponibilidad, anos_experiencia, cv_general_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.nombreCompleto,
          data.nombrePublico,
          data.tituloProfesional,
          data.bioCorta,
          data.bioLarga,
          data.fotoMediaId,
          data.email,
          data.ubicacion,
          data.nivelIngles,
          data.disponibilidad,
          data.mensajeDisponibilidad,
          data.anosExperiencia,
          data.cvGeneralId,
        ]
      );
    } else {
      await execute(
        `UPDATE perfil SET
          nombre_completo = ?, nombre_publico = ?, titulo_profesional = ?, bio_corta = ?, bio_larga = ?,
          foto_media_id = ?, email = ?, ubicacion = ?, nivel_ingles = ?, disponibilidad = ?,
          mensaje_disponibilidad = ?, anos_experiencia = ?, cv_general_id = ?
        WHERE id = ?`,
        [
          data.nombreCompleto,
          data.nombrePublico,
          data.tituloProfesional,
          data.bioCorta,
          data.bioLarga,
          data.fotoMediaId,
          data.email,
          data.ubicacion,
          data.nivelIngles,
          data.disponibilidad,
          data.mensajeDisponibilidad,
          data.anosExperiencia,
          data.cvGeneralId,
          existente.id,
        ]
      );
    }

    const actualizado = await this.get();
    if (!actualizado) throw new Error("No se pudo leer el Perfil recién guardado");
    return actualizado;
  }
}

export const perfilRepository = new PerfilRepository();
