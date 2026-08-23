import type { Configuracion } from "@hleon/types";
import { execute, query } from "../client.js";

const COLUMNS = `
  id, nombre_sitio AS nombreSitio, titulo_template AS tituloTemplate,
  descripcion_default AS descripcionDefault, imagen_og_default_id AS imagenOgDefaultId,
  dominio_base AS dominioBase, analytics_id AS analyticsId,
  google_search_console AS googleSearchConsole, textos_legales AS textosLegales,
  feature_flags AS featureFlags, creado_en AS creadoEn, actualizado_en AS actualizadoEn
`;

/** Singleton: SEO global y feature flags de sitio completo. */
export class ConfiguracionRepository {
  async get(): Promise<Configuracion | null> {
    const rows = await query<Configuracion>(`SELECT ${COLUMNS} FROM configuracion ORDER BY id LIMIT 1`);
    return rows[0] ?? null;
  }

  async upsert(data: Omit<Configuracion, "id" | "creadoEn" | "actualizadoEn">): Promise<Configuracion> {
    const existente = await this.get();
    const featureFlagsJson = data.featureFlags ? JSON.stringify(data.featureFlags) : null;
    const valores = [
      data.nombreSitio,
      data.tituloTemplate,
      data.descripcionDefault,
      data.imagenOgDefaultId,
      data.dominioBase,
      data.analyticsId,
      data.googleSearchConsole,
      data.textosLegales,
      featureFlagsJson,
    ];

    if (!existente) {
      await execute(
        `INSERT INTO configuracion (
          nombre_sitio, titulo_template, descripcion_default, imagen_og_default_id,
          dominio_base, analytics_id, google_search_console, textos_legales, feature_flags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        valores
      );
    } else {
      await execute(
        `UPDATE configuracion SET
          nombre_sitio = ?, titulo_template = ?, descripcion_default = ?, imagen_og_default_id = ?,
          dominio_base = ?, analytics_id = ?, google_search_console = ?, textos_legales = ?, feature_flags = ?
        WHERE id = ?`,
        [...valores, existente.id]
      );
    }

    const actualizado = await this.get();
    if (!actualizado) throw new Error("No se pudo leer la Configuración recién guardada");
    return actualizado;
  }
}

export const configuracionRepository = new ConfiguracionRepository();
