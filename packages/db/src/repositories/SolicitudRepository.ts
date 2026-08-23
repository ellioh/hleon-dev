import type { EstadoSolicitud, MotivoSolicitud, Solicitud } from "@hleon/types";
import { BaseRepository, type ColumnDef } from "./BaseRepository.js";

const COLUMNS: ColumnDef[] = [
  { ts: "id", db: "id" },
  { ts: "motivo", db: "motivo" },
  { ts: "nombre", db: "nombre" },
  { ts: "email", db: "email" },
  { ts: "mensaje", db: "mensaje" },
  { ts: "empresa", db: "empresa" },
  { ts: "tipoSistemaId", db: "tipo_sistema_id" },
  { ts: "presupuesto", db: "presupuesto" },
  { ts: "empresaReclutadora", db: "empresa_reclutadora" },
  { ts: "tipoRol", db: "tipo_rol" },
  { ts: "modalidad", db: "modalidad" },
  { ts: "rangoSalarial", db: "rango_salarial" },
  { ts: "urlVacante", db: "url_vacante" },
  { ts: "estado", db: "estado" },
  { ts: "notasInternas", db: "notas_internas" },
  { ts: "origen", db: "origen" },
  { ts: "fecha", db: "fecha" },
  { ts: "eliminadoEn", db: "eliminado_en" },
];

export class SolicitudRepository extends BaseRepository<Solicitud> {
  constructor() {
    super("solicitudes", COLUMNS, { softDelete: true });
  }

  async findByFiltro(opts: { motivo?: MotivoSolicitud; estado?: EstadoSolicitud } = {}): Promise<Solicitud[]> {
    const condiciones: string[] = [];
    const params: string[] = [];
    if (opts.motivo) {
      condiciones.push("motivo = ?");
      params.push(opts.motivo);
    }
    if (opts.estado) {
      condiciones.push("estado = ?");
      params.push(opts.estado);
    }
    return this.findAll({
      where: condiciones.length ? condiciones.join(" AND ") : undefined,
      params,
      orderBy: "fecha DESC",
    });
  }

  async contarPorMotivoYEstado(motivo: MotivoSolicitud, estado: EstadoSolicitud): Promise<number> {
    const rows = await this.findAll({ where: "motivo = ? AND estado = ?", params: [motivo, estado] });
    return rows.length;
  }
}

export const solicitudRepository = new SolicitudRepository();
