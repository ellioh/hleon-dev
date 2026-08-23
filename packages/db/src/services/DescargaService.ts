import type { Descarga, IdiomaDescarga } from "@hleon/types";
import { descargaRepository } from "../repositories/DescargaRepository.js";
import { ValidationError } from "./errors.js";

export type DatosDescarga = Omit<Descarga, "id" | "creadoEn" | "actualizadoEn" | "descargasContador">;

/** Regla de negocio: solo una Descarga puede ser predeterminada por idioma. */
export class DescargaService {
  async crear(datos: DatosDescarga): Promise<Descarga> {
    if (datos.esPredeterminado) {
      await descargaRepository.quitarPredeterminadoDe(datos.idioma);
    }
    return descargaRepository.create(datos);
  }

  async marcarComoPredeterminado(id: number): Promise<Descarga> {
    const descarga = await descargaRepository.findById(id);
    if (!descarga) throw new ValidationError(`No existe una descarga con id ${id}.`);

    await descargaRepository.quitarPredeterminadoDe(descarga.idioma);
    await descargaRepository.update(id, { esPredeterminado: true });
    return (await descargaRepository.findById(id)) as Descarga;
  }

  async registrarDescarga(id: number): Promise<void> {
    await descargaRepository.incrementarContador(id);
  }

  async obtenerPredeterminado(idioma: IdiomaDescarga): Promise<Descarga | null> {
    return descargaRepository.findPredeterminado(idioma);
  }
}

export const descargaService = new DescargaService();
