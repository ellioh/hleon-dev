import type { Proyecto, ProyectoResultado, ProyectoVideo } from "@hleon/types";
import { execute, query } from "../client.js";
import { BaseRepository, type ColumnDef } from "./BaseRepository.js";

const COLUMNS: ColumnDef[] = [
  { ts: "id", db: "id" },
  { ts: "nombre", db: "nombre" },
  { ts: "slug", db: "slug" },
  { ts: "resumenEjecutivo", db: "resumen_ejecutivo" },
  { ts: "clienteId", db: "cliente_id" },
  { ts: "esConfidencial", db: "es_confidencial" },
  { ts: "categoriaId", db: "categoria_id" },
  { ts: "estado", db: "estado" },
  { ts: "modalidad", db: "modalidad" },
  { ts: "fechaInicio", db: "fecha_inicio" },
  { ts: "fechaFin", db: "fecha_fin" },
  { ts: "elDesafio", db: "el_desafio" },
  { ts: "laSolucion", db: "la_solucion" },
  { ts: "miRol", db: "mi_rol" },
  { ts: "arquitectura", db: "arquitectura" },
  { ts: "retos", db: "retos" },
  { ts: "aprendizajes", db: "aprendizajes" },
  { ts: "imagenPrincipalId", db: "imagen_principal_id" },
  { ts: "destacado", db: "destacado" },
  { ts: "orden", db: "orden" },
  { ts: "visible", db: "visible" },
  { ts: "estadoPublicacion", db: "estado_publicacion" },
  { ts: "metaTitulo", db: "meta_titulo" },
  { ts: "metaDescripcion", db: "meta_descripcion" },
  { ts: "creadoEn", db: "creado_en" },
  { ts: "actualizadoEn", db: "actualizado_en" },
  { ts: "eliminadoEn", db: "eliminado_en" },
];

/**
 * El módulo más complejo del CMS (5 pestañas en el formulario). Además del
 * CRUD genérico, resuelve las colecciones relacionadas (resultados,
 * galería, videos, tecnologías) y aplica el enmascarado de confidencialidad
 * en la capa pública (ver `paraPublico`, usado por ProyectoService).
 */
export class ProyectoRepository extends BaseRepository<Proyecto> {
  constructor() {
    super("proyectos", COLUMNS, { softDelete: true });
  }

  async findBySlug(slug: string): Promise<Proyecto | null> {
    const rows = await query<Proyecto>(
      `SELECT ${this.selectClause()} FROM ${this.table} WHERE slug = ? AND ${this.activeClause()} LIMIT 1`,
      [slug]
    );
    return rows[0] ? this.conRelaciones(rows[0]) : null;
  }

  async findDestacados(limit = 3): Promise<Proyecto[]> {
    const rows = await this.findAll({
      where: "destacado = 1 AND estado_publicacion = 'publicado' AND visible = 1",
      orderBy: "orden ASC",
      limit,
    });
    return Promise.all(rows.map((p) => this.conRelaciones(p)));
  }

  async findPublicados(opts: { categoriaId?: number } = {}): Promise<Proyecto[]> {
    const condiciones = ["estado_publicacion = 'publicado'", "visible = 1"];
    const params: number[] = [];
    if (opts.categoriaId) {
      condiciones.push("categoria_id = ?");
      params.push(opts.categoriaId);
    }
    const rows = await this.findAll({ where: condiciones.join(" AND "), params, orderBy: "orden ASC" });
    return Promise.all(rows.map((p) => this.conRelaciones(p)));
  }

  /** Carga tecnologías, resultados, galería y videos de un proyecto ya obtenido. */
  private async conRelaciones(proyecto: Proyecto): Promise<Proyecto> {
    const [tecnologias, resultados, galeria, videos] = await Promise.all([
      query<{ tecnologiaId: number }>(
        "SELECT tecnologia_id AS tecnologiaId FROM proyecto_tecnologia WHERE proyecto_id = ?",
        [proyecto.id]
      ),
      query<ProyectoResultado>(
        "SELECT id, proyecto_id AS proyectoId, metrica, valor, descripcion, orden FROM proyecto_resultados WHERE proyecto_id = ? ORDER BY orden",
        [proyecto.id]
      ),
      query<{ mediaId: number }>(
        "SELECT media_id AS mediaId FROM proyecto_galeria WHERE proyecto_id = ? ORDER BY orden",
        [proyecto.id]
      ),
      query<ProyectoVideo>(
        "SELECT id, proyecto_id AS proyectoId, url, titulo, orden FROM proyecto_videos WHERE proyecto_id = ? ORDER BY orden",
        [proyecto.id]
      ),
    ]);

    proyecto.tecnologiaIds = tecnologias.map((t) => t.tecnologiaId);
    proyecto.resultados = resultados;
    proyecto.galeriaMediaIds = galeria.map((g) => g.mediaId);
    proyecto.videos = videos;
    return proyecto;
  }

  async setTecnologias(proyectoId: number, tecnologiaIds: number[]): Promise<void> {
    await execute("DELETE FROM proyecto_tecnologia WHERE proyecto_id = ?", [proyectoId]);
    for (const tecnologiaId of tecnologiaIds) {
      await execute("INSERT INTO proyecto_tecnologia (proyecto_id, tecnologia_id) VALUES (?, ?)", [
        proyectoId,
        tecnologiaId,
      ]);
    }
  }

  async existeSlug(slug: string, excluirId?: number): Promise<boolean> {
    return this.existsByColumn("slug", slug, excluirId);
  }

  /**
   * Enmascara los campos confidenciales antes de exponer el proyecto en
   * las rutas públicas (cliente y cifras exactas de resultados). Se usa
   * SOLO en la capa pública; el backoffice siempre ve el dato completo.
   */
  paraPublico(proyecto: Proyecto): Proyecto {
    if (!proyecto.esConfidencial) return proyecto;
    return { ...proyecto, clienteId: null };
  }
}

export const proyectoRepository = new ProyectoRepository();
