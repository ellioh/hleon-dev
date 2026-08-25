// Cliente de la API pública de Laravel para el módulo Educación. Mismo
// patrón defensivo que certificaciones-api.ts: nunca lanza, devuelve `[]`
// si Laravel no responde. Sin detalle por slug - insumo de /trayectoria,
// igual que Experiencia/Certificacion (ver ADR de Educación/hire-me).

const API_URL = process.env.LARAVEL_API_URL ?? "http://localhost:8123";

const REVALIDATE_SEGUNDOS = 3600;

export interface Educacion {
  id: number;
  institucion: string;
  titulo: string;
  tituloEn: string | null;
  campoEstudio: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  enCurso: boolean;
  descripcion: string | null;
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
      console.error(`[educaciones-api] ${path} respondió ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[educaciones-api] fallo al conectar con la API de Laravel (${path})`, err);
    return null;
  }
}

export async function getEducacionesVisibles(): Promise<Educacion[]> {
  const respuesta = await fetchApi<ColeccionApi<Educacion>>("/api/educaciones");
  return respuesta?.data ?? [];
}
