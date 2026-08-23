import type { Solicitud } from "@hleon/types";
import { solicitudRepository } from "../repositories/SolicitudRepository.js";
import { ValidationError } from "./errors.js";

export type DatosSolicitud = Omit<Solicitud, "id" | "fecha" | "eliminadoEn" | "estado" | "notasInternas">;

/**
 * Valida los campos condicionales por `motivo` (branching definido en la
 * estrategia de contenido): un lead de "empleo" no debería traer
 * `presupuesto`, uno de "proyecto" no debería traer `urlVacante`, aunque
 * el modelo los deje opcionales para no ser demasiado rígido con datos
 * de formularios reales.
 */
export class SolicitudService {
  async crear(datos: DatosSolicitud, origen?: string): Promise<Solicitud> {
    if (!datos.nombre || !datos.email || !datos.mensaje) {
      throw new ValidationError("Nombre, email y mensaje son obligatorios en toda solicitud.");
    }

    if (datos.motivo === "empleo" && !datos.tipoRol) {
      throw new ValidationError('Las solicitudes de motivo "empleo" requieren indicar el tipo de rol.');
    }

    return solicitudRepository.create({ ...datos, estado: "nuevo", notasInternas: null, origen: origen ?? null });
  }

  async cambiarEstado(id: number, estado: Solicitud["estado"]): Promise<Solicitud> {
    const existente = await solicitudRepository.findById(id);
    if (!existente) throw new ValidationError(`No existe una solicitud con id ${id}.`);
    await solicitudRepository.update(id, { estado });
    return (await solicitudRepository.findById(id)) as Solicitud;
  }

  async agregarNota(id: number, nota: string): Promise<Solicitud> {
    const existente = await solicitudRepository.findById(id);
    if (!existente) throw new ValidationError(`No existe una solicitud con id ${id}.`);
    const notaFinal = existente.notasInternas ? `${existente.notasInternas}\n${nota}` : nota;
    await solicitudRepository.update(id, { notasInternas: notaFinal });
    return (await solicitudRepository.findById(id)) as Solicitud;
  }
}

export const solicitudService = new SolicitudService();
