// Cliente de la API pública de Laravel para el módulo Experiencia. Mismo
// patrón defensivo que proyectos-api.ts: nunca lanza, devuelve `[]` si
// Laravel no responde. Sin `getExperienciaPorSlug` - a diferencia de
// Proyecto, Experiencia no tiene página propia por entrada (ver ADR 0007),
// /trayectoria consume siempre la lista completa.

const API_URL = process.env.LARAVEL_API_URL ?? "http://localhost:8123";

const REVALIDATE_SEGUNDOS = 3600;

export interface Organizacion {
  id: number;
  nombre: string;
  url: string | null;
}

export interface Tecnologia {
  id: number;
  nombre: string;
  slug: string;
}

export interface ExperienciaLogro {
  id: number;
  texto: string;
  orden: number;
}

export interface ExperienciaProyecto {
  id: number;
  nombre: string;
  slug: string;
}

export interface Experiencia {
  id: number;
  organizacion: Organizacion | null;
  rol: string;
  rolEn: string | null;
  modalidad: "remoto" | "presencial" | "hibrido" | "freelance";
  fechaInicio: string;
  fechaFin: string | null;
  actual: boolean;
  resumen: string;
  resumenEn: string | null;
  descripcion: string;
  ubicacion: string | null;
  logros: ExperienciaLogro[];
  tecnologias: Tecnologia[];
  proyectos: ExperienciaProyecto[];
  destacado: boolean;
}

interface ColeccionApi<T> {
  data: T[];
}

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SEGUNDOS },
    });
    if (!res.ok) {
      console.error(`[experiencias-api] ${path} respondió ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[experiencias-api] fallo al conectar con la API de Laravel (${path})`, err);
    return null;
  }
}

export async function getExperienciasPublicadas(): Promise<Experiencia[]> {
  const respuesta = await fetchApi<ColeccionApi<Experiencia>>("/api/experiencias");
  return respuesta?.data ?? [];
}
