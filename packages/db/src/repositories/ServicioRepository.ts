import type { Servicio, ServicioEntregable } from "@hleon/types";
import { query } from "../client.js";
import { BaseRepository, type ColumnDef } from "./BaseRepository.js";

const COLUMNS: ColumnDef[] = [
  { ts: "id", db: "id" },
  { ts: "nombre", db: "nombre" },
  { ts: "slug", db: "slug" },
  { ts: "iconoEmoji", db: "icono_emoji" },
  { ts: "resumenBreve", db: "resumen_breve" },
  { ts: "descripcionCompleta", db: "descripcion_completa" },
  { ts: "rangoPrecioMin", db: "rango_precio_min" },
  { ts: "rangoPrecioMax", db: "rango_precio_max" },
  { ts: "moneda", db: "moneda" },
  { ts: "tiempoEstimado", db: "tiempo_estimado" },
  { ts: "proyectoEjemploId", db: "proyecto_ejemplo_id" },
  { ts: "categoriaId", db: "categoria_id" },
  { ts: "visible", db: "visible" },
  { ts: "destacado", db: "destacado" },
  { ts: "orden", db: "orden" },
];

export class ServicioRepository extends BaseRepository<Servicio> {
  constructor() {
    super("servicios", COLUMNS, { softDelete: true });
  }

  async findBySlug(slug: string): Promise<Servicio | null> {
    const rows = await query<Servicio>(
      `SELECT ${this.selectClause()} FROM ${this.table} WHERE slug = ? AND ${this.activeClause()} LIMIT 1`,
      [slug]
    );
    if (!rows[0]) return null;
    return this.conEntregables(rows[0]);
  }

  async findVisibles(): Promise<Servicio[]> {
    const rows = await this.findAll({ where: "visible = 1", orderBy: "orden ASC" });
    return Promise.all(rows.map((s) => this.conEntregables(s)));
  }

  private async conEntregables(servicio: Servicio): Promise<Servicio> {
    servicio.entregablesTipicos = await query<ServicioEntregable>(
      "SELECT id, servicio_id AS servicioId, texto, orden FROM servicio_entregables WHERE servicio_id = ? ORDER BY orden",
      [servicio.id]
    );
    return servicio;
  }
}

export const servicioRepository = new ServicioRepository();
