import type { Testimonio } from "@hleon/types";
import { testimonioRepository } from "../repositories/TestimonioRepository.js";
import { ValidationError } from "./errors.js";

export type DatosTestimonio = Omit<Testimonio, "id" | "creadoEn" | "eliminadoEn">;

/**
 * Corrige el hallazgo de la auditoría técnica sobre testimonios no
 * verificables: `publicado=true` es rechazado aquí si
 * `consentimientoVerificado` es false, con un mensaje explícito - el
 * CHECK de la migración 0019 es la defensa de última instancia, no la
 * primera línea de validación.
 */
export class TestimonioService {
  async crear(datos: DatosTestimonio): Promise<Testimonio> {
    this.validarConsentimiento(datos.publicado, datos.consentimientoVerificado);
    return testimonioRepository.create(datos);
  }

  async actualizar(id: number, datos: Partial<DatosTestimonio>): Promise<Testimonio> {
    const existente = await testimonioRepository.findById(id);
    if (!existente) throw new ValidationError(`No existe un testimonio con id ${id}.`);

    const publicado = datos.publicado ?? existente.publicado;
    const consentimiento = datos.consentimientoVerificado ?? existente.consentimientoVerificado;
    this.validarConsentimiento(publicado, consentimiento);

    await testimonioRepository.update(id, datos);
    return (await testimonioRepository.findById(id)) as Testimonio;
  }

  async publicar(id: number): Promise<Testimonio> {
    const testimonio = await testimonioRepository.findById(id);
    if (!testimonio) throw new ValidationError(`No existe un testimonio con id ${id}.`);
    this.validarConsentimiento(true, testimonio.consentimientoVerificado);
    await testimonioRepository.update(id, { publicado: true });
    return (await testimonioRepository.findById(id)) as Testimonio;
  }

  private validarConsentimiento(publicado: boolean, consentimientoVerificado: boolean): void {
    if (publicado && !consentimientoVerificado) {
      throw new ValidationError(
        "No se puede publicar un testimonio sin marcar el consentimiento como verificado."
      );
    }
  }
}

export const testimonioService = new TestimonioService();
