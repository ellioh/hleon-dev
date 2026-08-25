// Cliente de la API pública de Laravel para el módulo Certificaciones.
// Mismo patrón defensivo que el resto: nunca lanza, devuelve `[]` si
// Laravel no responde. Sin detalle por slug - insumo de /trayectoria,
// igual que Experiencia (ver ADR 0007/0010).

const API_URL = process.env.LARAVEL_API_URL ?? "http://localhost:8123";

const REVALIDATE_SEGUNDOS = 3600;

export interface Media {
  id: number;
  url: string;
  altText: string | null;
}

export interface Certificacion {
  id: number;
  nombre: string;
  emisor: string;
  fechaObtencion: string;
  fechaExpiracion: string | null;
  credencialId: string | null;
  urlVerificacion: string | null;
  imagenInsignia: Media | null;
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
      console.error(`[certificaciones-api] ${path} respondió ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[certificaciones-api] fallo al conectar con la API de Laravel (${path})`, err);
    return null;
  }
}

export async function getCertificacionesVisibles(): Promise<Certificacion[]> {
  const respuesta = await fetchApi<ColeccionApi<Certificacion>>("/api/certificaciones");
  return respuesta?.data ?? [];
}
