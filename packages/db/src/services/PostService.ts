import type { Post } from "@hleon/types";
import { postRepository } from "../repositories/PostRepository.js";
import { slugify } from "../util/slugify.js";
import { ValidationError } from "./errors.js";

export type DatosPost = Omit<Post, "id" | "creadoEn" | "eliminadoEn" | "slug" | "fechaActualizacion"> & {
  slug?: string;
};

export class PostService {
  async crear(datos: DatosPost): Promise<Post> {
    const slug = await this.resolverSlugUnico(datos.slug ?? datos.titulo);
    return postRepository.create({ ...datos, slug, fechaActualizacion: new Date().toISOString() });
  }

  async actualizar(id: number, datos: Partial<DatosPost>): Promise<Post> {
    const existente = await postRepository.findById(id);
    if (!existente) throw new ValidationError(`No existe un artículo con id ${id}.`);

    let slug = existente.slug;
    if (datos.slug || datos.titulo) {
      slug = await this.resolverSlugUnico(datos.slug ?? datos.titulo ?? existente.titulo, id);
    }

    await postRepository.update(id, { ...datos, slug, fechaActualizacion: new Date().toISOString() });
    return (await postRepository.findById(id)) as Post;
  }

  async publicar(id: number): Promise<Post> {
    const post = await postRepository.findById(id);
    if (!post) throw new ValidationError(`No existe un artículo con id ${id}.`);
    if (!post.metaDescripcion || !post.categoriaId) {
      throw new ValidationError("No se puede publicar un artículo sin categoría o meta descripción.");
    }
    await postRepository.update(id, { publicado: true });
    return (await postRepository.findById(id)) as Post;
  }

  private async resolverSlugUnico(base: string, excluirId?: number): Promise<string> {
    const slugBase = slugify(base);
    let candidato = slugBase;
    let sufijo = 2;
    while (await postRepository.existeSlug(candidato, excluirId)) {
      candidato = `${slugBase}-${sufijo}`;
      sufijo++;
    }
    return candidato;
  }
}

export const postService = new PostService();
