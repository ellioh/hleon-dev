// Cliente de la API pública de Laravel para el módulo Servicios. Mismo
// patrón defensivo que proyectos-api.ts/posts-api.ts: nunca lanza,
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

export type Moneda = "USD" | "PEN";

export interface ServicioEntregable {
  id: number;
  texto: string;
  orden: number;
}

export interface ProyectoEjemplo {
  id: number;
  nombre: string;
  slug: string;
  imagenPrincipal: Media | null;
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

export interface ServicioSummary {
  id: number;
  nombre: string;
  slug: string;
  iconoEmoji: string | null;
  resumenBreve: string;
  categoria: Categoria | null;
  rangoPrecioMin: string | null;
  rangoPrecioMax: string | null;
  moneda: Moneda | null;
  tiempoEstimado: string | null;
  visible: boolean;
  destacado: boolean;
  orden: number;
}

export interface Servicio extends ServicioSummary {
  descripcionCompleta: string;
  proyectoEjemplo: ProyectoEjemplo | null;
  entregables: ServicioEntregable[];
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
        console.error(`[servicios-api] ${path} respondió ${res.status}`);
      }
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[servicios-api] fallo al conectar con la API de Laravel (${path})`, err);
    return null;
  }
}

export async function getServiciosVisibles(): Promise<ServicioSummary[]> {
  const respuesta = await fetchApi<ColeccionApi<ServicioSummary>>(
    "/api/servicios?por_pagina=50&orden_por=orden&orden_direccion=asc"
  );
  return respuesta?.data ?? [];
}

export async function getServicioPorSlug(slug: string): Promise<Servicio | null> {
  const respuesta = await fetchApi<RecursoApi<Servicio>>(`/api/servicios/${encodeURIComponent(slug)}`);
  return respuesta?.data ?? null;
}
