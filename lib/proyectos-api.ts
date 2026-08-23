// Cliente de la API pública de Laravel para el módulo Proyectos. Server-only:
// usa `process.env.LARAVEL_API_URL` sin prefijo NEXT_PUBLIC_ porque solo se
// llama desde Server Components (nunca se necesita en el bundle del cliente).
//
// Laravel todavía no está desplegado en una URL pública (solo corre local /
// eventualmente en el VPS vía Docker) - todas las funciones aquí devuelven
// listas vacías / null en vez de lanzar si la API no responde, para que
// build y render no se rompan mientras esa pieza de infraestructura no esté
// lista. Ver docs/api/proyectos.md.

const API_URL = process.env.LARAVEL_API_URL ?? "http://localhost:8123";

// Revalida cada hora: el contenido lo edita un admin manualmente y muy rara
// vez, no hace falta refrescar en cada request.
const REVALIDATE_SEGUNDOS = 3600;

export interface Media {
  id: number;
  url: string;
  tipo: string;
  altText: string | null;
  ancho: number | null;
  alto: number | null;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

export interface Tecnologia {
  id: number;
  nombre: string;
  slug: string;
  categoria: string | null;
  icono: string | null;
  logo: Media | null;
  colorAcento: string | null;
}

export interface Organizacion {
  id: number;
  nombre: string;
  logo: Media | null;
  url: string | null;
}

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

export interface ProyectoResultado {
  id: number;
  metrica: string;
  valor: string;
  descripcion: string | null;
  orden: number;
}

export interface ProyectoVideo {
  id: number;
  url: string;
  titulo: string | null;
  orden: number;
}

export interface ProyectoSummary {
  id: number;
  nombre: string;
  slug: string;
  resumenEjecutivo: string;
  categoria: Categoria | null;
  organizacion: Organizacion | null;
  imagenPrincipal: Media | null;
  urlPublica: string | null;
  tecnologias: Tecnologia[];
  estado: string;
  modalidad: string | null;
  destacado: boolean;
  fechaInicio: string | null;
  orden: number;
}

export interface Proyecto extends ProyectoSummary {
  esConfidencial: boolean;
  fechaFin: string | null;
  elDesafio: string;
  laSolucion: string;
  miRol: string;
  arquitectura: string | null;
  retos: string | null;
  aprendizajes: string | null;
  galeria: Media[];
  videos: ProyectoVideo[];
  resultados: ProyectoResultado[];
  seo: Seo | null;
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
        console.error(`[proyectos-api] ${path} respondió ${res.status}`);
      }
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[proyectos-api] fallo al conectar con la API de Laravel (${path})`, err);
    return null;
  }
}

export async function getProyectosPublicados(): Promise<ProyectoSummary[]> {
  const respuesta = await fetchApi<ColeccionApi<ProyectoSummary>>(
    "/api/proyectos?por_pagina=50&orden_por=orden&orden_direccion=asc"
  );
  return respuesta?.data ?? [];
}

export async function getProyectoPorSlug(slug: string): Promise<Proyecto | null> {
  const respuesta = await fetchApi<RecursoApi<Proyecto>>(`/api/proyectos/${encodeURIComponent(slug)}`);
  return respuesta?.data ?? null;
}
