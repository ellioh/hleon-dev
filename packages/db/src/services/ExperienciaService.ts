import type { Experiencia } from "@hleon/types";
import { experienciaRepository } from "../repositories/ExperienciaRepository.js";
import { ValidationError } from "./errors.js";

export type DatosExperiencia = Omit<
  Experiencia,
  "id" | "creadoEn" | "actualizadoEn" | "eliminadoEn" | "logros" | "tecnologiaIds" | "proyectoIds"
>;

/**
 * Regla de negocio: si `actual=true`, `fechaFin` debe quedar vacía; si
 * existe `fechaFin`, debe ser posterior a `fechaInicio`. El CHECK de la
 * migración 0011 refuerza esto a nivel de base de datos.
 */
export class ExperienciaService {
  async crear(datos: DatosExperiencia, tecnologiaIds: number[] = []): Promise<Experiencia> {
    this.validar(datos);
    const creada = await experienciaRepository.create(datos);
    if (tecnologiaIds.length) await experienciaRepository.setTecnologias(creada.id, tecnologiaIds);
    return creada;
  }

  async actualizar(id: number, datos: Partial<DatosExperiencia>, tecnologiaIds?: number[]): Promise<Experiencia> {
    const existente = await experienciaRepository.findById(id);
    if (!existente) throw new ValidationError(`No existe una experiencia con id ${id}.`);

    const combinado = { ...existente, ...datos };
    this.validar(combinado);

    await experienciaRepository.update(id, datos);
    if (tecnologiaIds) await experienciaRepository.setTecnologias(id, tecnologiaIds);
    return (await experienciaRepository.findById(id)) as Experiencia;
  }

  private validar(datos: { actual: boolean; fechaInicio: string; fechaFin: string | null }): void {
    if (datos.actual && datos.fechaFin) {
      throw new ValidationError('Una experiencia marcada como "actual" no puede tener fecha de fin.');
    }
    if (!datos.actual && datos.fechaFin && new Date(datos.fechaFin) <= new Date(datos.fechaInicio)) {
      throw new ValidationError("La fecha de fin debe ser posterior a la fecha de inicio.");
    }
  }
}

export const experienciaService = new ExperienciaService();
