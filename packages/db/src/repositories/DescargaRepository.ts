import type { Descarga, IdiomaDescarga } from "@hleon/types";
import { execute } from "../client.js";
import { BaseRepository, type ColumnDef } from "./BaseRepository.js";

const COLUMNS: ColumnDef[] = [
  { ts: "id", db: "id" },
  { ts: "nombre", db: "nombre" },
  { ts: "idioma", db: "idioma" },
  { ts: "archivoMediaId", db: "archivo_media_id" },
  { ts: "version", db: "version" },
  { ts: "esPredeterminado", db: "es_predeterminado" },
  { ts: "visible", db: "visible" },
  { ts: "descargasContador", db: "descargas_contador" },
  { ts: "creadoEn", db: "creado_en" },
  { ts: "actualizadoEn", db: "actualizado_en" },
];

/**
 * La regla "un solo predeterminado por idioma" se aplica en
 * DescargaService (que llama a `quitarPredeterminadoDe` antes de marcar
 * uno nuevo) - el repositorio expone la operación pero no decide cuándo usarla.
 */
export class DescargaRepository extends BaseRepository<Descarga> {
  constructor() {
    super("descargas", COLUMNS);
  }

  async findPredeterminado(idioma: IdiomaDescarga): Promise<Descarga | null> {
    const rows = await this.findAll({ where: "idioma = ? AND es_predeterminado = 1", params: [idioma], limit: 1 });
    return rows[0] ?? null;
  }

  async quitarPredeterminadoDe(idioma: IdiomaDescarga): Promise<void> {
    await execute("UPDATE descargas SET es_predeterminado = 0 WHERE idioma = ?", [idioma]);
  }

  async incrementarContador(id: number): Promise<void> {
    await execute("UPDATE descargas SET descargas_contador = descargas_contador + 1 WHERE id = ?", [id]);
  }
}

export const descargaRepository = new DescargaRepository();
