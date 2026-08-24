// Cliente de la API pública de Laravel para el módulo Blog. Mismo patrón
// defensivo que proyectos-api.ts/experiencias-api.ts: nunca lanza,
// devuelve `[]`/`null` si Laravel no responde.

const API_URL = process.env.LARAVEL_API_URL ?? "http://localhost:8123";

const REVALIDATE_SEGUNDOS = 3600;

export interface Media {
  id: number;
  url: string;
  altText: string | null;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

export interface Autor {
  nombre: string;
  tituloProfesional: string;
  foto: Media | null;
}

export type TipoAudiencia = "consultoria" | "carrera_arquitectura" | "ambos";

export interface Seo {
  metaTitulo: string | null;
  metaDescripcion: string | null;
  canonicalUrl: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitulo: string | null;
  ogDescripcion: string | null;
  ogImagen: Media | null;
  ogTipo: string | null;
  twitterCard: string | null;
  twitterTitulo: string | null;
  twitterDescripcion: string | null;
  twitterImagen: Media | null;
}

export interface PostSummary {
  id: number;
  titulo: string;
  slug: string;
  resumen: string;
  categoria: Categoria | null;
  autor: Autor | null;
  tipoAudiencia: TipoAudiencia;
  tags: string[];
  imagenDestacada: Media | null;
  publicado: boolean;
  fechaPublicacion: string | null;
}

export interface Post extends PostSummary {
  contenido: string;
  seo: Seo | null;
  fechaActualizacion: string;
}

interface ColeccionApi<T> {
  data: T[];
}

interface RecursoApi<T> {
  data: T;
}

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SEGUNDOS },
    });
    if (!res.ok) {
      if (res.status !== 404) {
        console.error(`[posts-api] ${path} respondió ${res.status}`);
      }
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[posts-api] fallo al conectar con la API de Laravel (${path})`, err);
    return null;
  }
}

export async function getPostsPublicados(): Promise<PostSummary[]> {
  const respuesta = await fetchApi<ColeccionApi<PostSummary>>(
    "/api/posts?por_pagina=50&orden_por=fecha_publicacion&orden_direccion=desc"
  );
  return respuesta?.data ?? [];
}

export async function getPostPorSlug(slug: string): Promise<Post | null> {
  const respuesta = await fetchApi<RecursoApi<Post>>(`/api/posts/${encodeURIComponent(slug)}`);
  return respuesta?.data ?? null;
}
