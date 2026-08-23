import type { Experiencia, ExperienciaLogro } from "@hleon/types";
import { execute, query } from "../client.js";
import { BaseRepository, type ColumnDef } from "./BaseRepository.js";

const COLUMNS: ColumnDef[] = [
  { ts: "id", db: "id" },
  { ts: "empresa", db: "empresa" },
  { ts: "rol", db: "rol" },
  { ts: "modalidad", db: "modalidad" },
  { ts: "fechaInicio", db: "fecha_inicio" },
  { ts: "fechaFin", db: "fecha_fin" },
  { ts: "actual", db: "actual" },
  { ts: "resumen", db: "resumen" },
  { ts: "descripcion", db: "descripcion" },
  { ts: "ubicacion", db: "ubicacion" },
  { ts: "destacado", db: "destacado" },
  { ts: "visible", db: "visible" },
  { ts: "orden", db: "orden" },
  { ts: "estadoPublicacion", db: "estado_publicacion" },
  { ts: "creadoEn", db: "creado_en" },
  { ts: "actualizadoEn", db: "actualizado_en" },
  { ts: "eliminadoEn", db: "eliminado_en" },
];

/** Línea de tiempo laboral - insumo de /trayectoria y /hire-me. */
export class ExperienciaRepository extends BaseRepository<Experiencia> {
  constructor() {
    super("experiencias", COLUMNS, { softDelete: true });
  }

  async findAllOrdenadas(): Promise<Experiencia[]> {
    const rows = await this.findAll({ orderBy: "fecha_inicio DESC, orden ASC" });
    return Promise.all(rows.map((e) => this.conRelaciones(e)));
  }

  private async conRelaciones(experiencia: Experiencia): Promise<Experiencia> {
    const [logros, tecnologias, proyectos] = await Promise.all([
      query<ExperienciaLogro>(
        "SELECT id, experiencia_id AS experienciaId, texto, orden FROM experiencia_logros WHERE experiencia_id = ? ORDER BY orden",
        [experiencia.id]
      ),
      query<{ tecnologiaId: number }>(
        "SELECT tecnologia_id AS tecnologiaId FROM experiencia_tecnologia WHERE experiencia_id = ?",
        [experiencia.id]
      ),
      query<{ proyectoId: number }>(
        "SELECT proyecto_id AS proyectoId FROM experiencia_proyecto WHERE experiencia_id = ?",
        [experiencia.id]
      ),
    ]);

    experiencia.logros = logros;
    experiencia.tecnologiaIds = tecnologias.map((t) => t.tecnologiaId);
    experiencia.proyectoIds = proyectos.map((p) => p.proyectoId);
    return experiencia;
  }

  async setTecnologias(experienciaId: number, tecnologiaIds: number[]): Promise<void> {
    await execute("DELETE FROM experiencia_tecnologia WHERE experiencia_id = ?", [experienciaId]);
    for (const tecnologiaId of tecnologiaIds) {
      await execute("INSERT INTO experiencia_tecnologia (experiencia_id, tecnologia_id) VALUES (?, ?)", [
        experienciaId,
        tecnologiaId,
      ]);
    }
  }
}

export const experienciaRepository = new ExperienciaRepository();
