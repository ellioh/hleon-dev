import type { Hero, HeroEstadistica } from "@hleon/types";
import { execute, query } from "../client.js";

const COLUMNS = `
  id, headline, subheadline,
  fork_empresa_titulo AS forkEmpresaTitulo, fork_empresa_descripcion AS forkEmpresaDescripcion,
  fork_empresa_cta_label AS forkEmpresaCtaLabel, fork_empresa_cta_url AS forkEmpresaCtaUrl,
  fork_reclutador_titulo AS forkReclutadorTitulo, fork_reclutador_descripcion AS forkReclutadorDescripcion,
  fork_reclutador_cta_label AS forkReclutadorCtaLabel, fork_reclutador_cta_url AS forkReclutadorCtaUrl,
  cta_final_titulo AS ctaFinalTitulo, cta_final_descripcion AS ctaFinalDescripcion,
  creado_en AS creadoEn, actualizado_en AS actualizadoEn
`;

/** Singleton: contenido del fork del home. Ver PerfilRepository para el patrón. */
export class HeroRepository {
  async get(): Promise<Hero | null> {
    const rows = await query<Hero>(`SELECT ${COLUMNS} FROM hero ORDER BY id LIMIT 1`);
    const hero = rows[0];
    if (!hero) return null;

    hero.estadisticas = await query<HeroEstadistica>(
      `SELECT id, hero_id AS heroId, numero, etiqueta, orden FROM hero_estadisticas WHERE hero_id = ? ORDER BY orden`,
      [hero.id]
    );
    return hero;
  }

  async upsert(data: Omit<Hero, "id" | "creadoEn" | "actualizadoEn" | "estadisticas">): Promise<Hero> {
    const existente = await this.get();
    const valores = [
      data.headline,
      data.subheadline,
      data.forkEmpresaTitulo,
      data.forkEmpresaDescripcion,
      data.forkEmpresaCtaLabel,
      data.forkEmpresaCtaUrl,
      data.forkReclutadorTitulo,
      data.forkReclutadorDescripcion,
      data.forkReclutadorCtaLabel,
      data.forkReclutadorCtaUrl,
      data.ctaFinalTitulo,
      data.ctaFinalDescripcion,
    ];

    if (!existente) {
      await execute(
        `INSERT INTO hero (
          headline, subheadline, fork_empresa_titulo, fork_empresa_descripcion,
          fork_empresa_cta_label, fork_empresa_cta_url, fork_reclutador_titulo,
          fork_reclutador_descripcion, fork_reclutador_cta_label, fork_reclutador_cta_url,
          cta_final_titulo, cta_final_descripcion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        valores
      );
    } else {
      await execute(
        `UPDATE hero SET
          headline = ?, subheadline = ?, fork_empresa_titulo = ?, fork_empresa_descripcion = ?,
          fork_empresa_cta_label = ?, fork_empresa_cta_url = ?, fork_reclutador_titulo = ?,
          fork_reclutador_descripcion = ?, fork_reclutador_cta_label = ?, fork_reclutador_cta_url = ?,
          cta_final_titulo = ?, cta_final_descripcion = ?
        WHERE id = ?`,
        [...valores, existente.id]
      );
    }

    const actualizado = await this.get();
    if (!actualizado) throw new Error("No se pudo leer el Hero recién guardado");
    return actualizado;
  }
}

export const heroRepository = new HeroRepository();
