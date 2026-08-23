import type { Testimonio } from "@hleon/types";
import { BaseRepository, type ColumnDef } from "./BaseRepository.js";

const COLUMNS: ColumnDef[] = [
  { ts: "id", db: "id" },
  { ts: "nombreCliente", db: "nombre_cliente" },
  { ts: "rolCliente", db: "rol_cliente" },
  { ts: "clienteId", db: "cliente_id" },
  { ts: "texto", db: "texto" },
  { ts: "calificacion", db: "calificacion" },
  { ts: "proyectoId", db: "proyecto_id" },
  { ts: "consentimientoVerificado", db: "consentimiento_verificado" },
  { ts: "publicado", db: "publicado" },
  { ts: "destacado", db: "destacado" },
  { ts: "orden", db: "orden" },
  { ts: "fechaRecibido", db: "fecha_recibido" },
  { ts: "creadoEn", db: "creado_en" },
  { ts: "eliminadoEn", db: "eliminado_en" },
];

/**
 * La regla "publicado requiere consentimiento verificado" se aplica en
 * TestimonioService, no aquí - el repositorio solo persiste; el CHECK de
 * la migración 0019 es la última línea de defensa si algo se salta el
 * service (ver documento del CMS, módulo Testimonios).
 */
export class TestimonioRepository extends BaseRepository<Testimonio> {
  constructor() {
    super("testimonios", COLUMNS, { softDelete: true });
  }

  async findPublicados(opts: { proyectoId?: number } = {}): Promise<Testimonio[]> {
    const condiciones = ["publicado = 1"];
    const params: number[] = [];
    if (opts.proyectoId) {
      condiciones.push("proyecto_id = ?");
      params.push(opts.proyectoId);
    }
    return this.findAll({ where: condiciones.join(" AND "), params, orderBy: "orden ASC" });
  }
}

export const testimonioRepository = new TestimonioRepository();
