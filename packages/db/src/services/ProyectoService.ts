import type { Proyecto } from "@hleon/types";
import { proyectoRepository } from "../repositories/ProyectoRepository.js";
import { slugify } from "../util/slugify.js";
import { ValidationError } from "./errors.js";

export type DatosProyecto = Omit<
  Proyecto,
  "id" | "creadoEn" | "actualizadoEn" | "eliminadoEn" | "resultados" | "galeriaMediaIds" | "videos" | "tecnologiaIds" | "proyectosRelacionadosIds" | "slug"
> & { slug?: string };

/**
 * Reglas de negocio de Proyecto: slug único (autogenerado desde `nombre`
 * si no se especifica), fechas coherentes, y enmascarado de
 * confidencialidad delegado al repositorio (`paraPublico`).
 */
export class ProyectoService {
  async crear(datos: DatosProyecto, tecnologiaIds: number[]): Promise<Proyecto> {
    const slug = await this.resolverSlugUnico(datos.slug ?? datos.nombre);
    this.validarFechas(datos.fechaInicio, datos.fechaFin);

    if (tecnologiaIds.length === 0) {
      throw new ValidationError("Un proyecto debe tener al menos una tecnología asociada.");
    }

    const creado = await proyectoRepository.create({ ...datos, slug });
    await proyectoRepository.setTecnologias(creado.id, tecnologiaIds);
    return (await proyectoRepository.findById(creado.id)) as Proyecto;
  }

  async actualizar(id: number, datos: Partial<DatosProyecto>, tecnologiaIds?: number[]): Promise<Proyecto> {
    const existente = await proyectoRepository.findById(id);
    if (!existente) throw new ValidationError(`No existe un proyecto con id ${id}.`);

    let slug = existente.slug;
    if (datos.slug || datos.nombre) {
      slug = await this.resolverSlugUnico(datos.slug ?? datos.nombre ?? existente.nombre, id);
    }

    this.validarFechas(datos.fechaInicio ?? existente.fechaInicio, datos.fechaFin ?? existente.fechaFin);

    await proyectoRepository.update(id, { ...datos, slug });
    if (tecnologiaIds) await proyectoRepository.setTecnologias(id, tecnologiaIds);

    return (await proyectoRepository.findById(id)) as Proyecto;
  }

  async publicar(id: number): Promise<Proyecto> {
    const proyecto = await proyectoRepository.findById(id);
    if (!proyecto) throw new ValidationError(`No existe un proyecto con id ${id}.`);
    if (!proyecto.elDesafio || !proyecto.laSolucion || !proyecto.miRol) {
      throw new ValidationError("No se puede publicar un proyecto sin desafío, solución y rol descritos.");
    }
    await proyectoRepository.update(id, { estadoPublicacion: "publicado" });
    return (await proyectoRepository.findById(id)) as Proyecto;
  }

  private async resolverSlugUnico(base: string, excluirId?: number): Promise<string> {
    const slugBase = slugify(base);
    let candidato = slugBase;
    let sufijo = 2;
    while (await proyectoRepository.existeSlug(candidato, excluirId)) {
      candidato = `${slugBase}-${sufijo}`;
      sufijo++;
    }
    return candidato;
  }

  private validarFechas(fechaInicio: string, fechaFin: string | null): void {
    if (fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) {
      throw new ValidationError("La fecha de fin debe ser posterior a la fecha de inicio.");
    }
  }
}

export const proyectoService = new ProyectoService();
