import type { Post } from "@hleon/types";
import { query } from "../client.js";
import { BaseRepository, type ColumnDef } from "./BaseRepository.js";

const COLUMNS: ColumnDef[] = [
  { ts: "id", db: "id" },
  { ts: "titulo", db: "titulo" },
  { ts: "slug", db: "slug" },
  { ts: "resumen", db: "resumen" },
  { ts: "contenido", db: "contenido" },
  { ts: "categoriaId", db: "categoria_id" },
  { ts: "tipoAudiencia", db: "tipo_audiencia" },
  { ts: "tags", db: "tags" },
  { ts: "metaDescripcion", db: "meta_descripcion" },
  { ts: "imagenDestacadaId", db: "imagen_destacada_id" },
  { ts: "autorId", db: "autor_id" },
  { ts: "publicado", db: "publicado" },
  { ts: "fechaPublicacion", db: "fecha_publicacion" },
  { ts: "fechaActualizacion", db: "fecha_actualizacion" },
  { ts: "creadoEn", db: "creado_en" },
  { ts: "eliminadoEn", db: "eliminado_en" },
];

export class PostRepository extends BaseRepository<Post> {
  constructor() {
    super("posts", COLUMNS, { softDelete: true });
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const rows = await query<Post>(
      `SELECT ${this.selectClause()} FROM ${this.table} WHERE slug = ? AND ${this.activeClause()} LIMIT 1`,
      [slug]
    );
    return rows[0] ?? null;
  }

  async findPublicados(opts: { categoriaId?: number; limit?: number } = {}): Promise<Post[]> {
    const condiciones = ["publicado = 1"];
    const params: number[] = [];
    if (opts.categoriaId) {
      condiciones.push("categoria_id = ?");
      params.push(opts.categoriaId);
    }
    return this.findAll({
      where: condiciones.join(" AND "),
      params,
      orderBy: "fecha_publicacion DESC",
      limit: opts.limit,
    });
  }

  async existeSlug(slug: string, excluirId?: number): Promise<boolean> {
    return this.existsByColumn("slug", slug, excluirId);
  }
}

export const postRepository = new PostRepository();
