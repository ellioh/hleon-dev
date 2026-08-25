// Cliente de la API pública de Laravel para Perfil. Mismo patrón
// defensivo que el resto: nunca lanza, devuelve `null` si Laravel no
// responde o si el perfil todavía no se cargó. Insumo de /hire-me
// (ver ADR de Educación/hire-me) - sin uso previo en el sitio público.

const API_URL = process.env.LARAVEL_API_URL ?? "http://localhost:8123";

const REVALIDATE_SEGUNDOS = 3600;

export interface Media {
  id: number;
  url: string;
  altText: string | null;
}

export interface Perfil {
  id: number;
  nombreCompleto: string;
  nombrePublico: string | null;
  tituloProfesional: string;
  tituloProfesionalEn: string | null;
  bioCorta: string;
  bioLarga: string;
  bioLargaEn: string | null;
  foto: Media | null;
  email: string;
  ubicacion: string;
  nivelIngles: "basico" | "intermedio" | "avanzado" | "profesional" | "nativo";
  disponibilidad: "abierto_remoto" | "abierto_proyectos" | "abierto_ambos" | "no_disponible";
  mensajeDisponibilidad: string | null;
  anosExperiencia: number;
}

interface RespuestaApi<T> {
  data: T | null;
}

export async function getPerfil(): Promise<Perfil | null> {
  try {
    const res = await fetch(`${API_URL}/api/perfil`, {
      next: { revalidate: REVALIDATE_SEGUNDOS },
    });
    if (!res.ok) {
      console.error(`[perfil-api] /api/perfil respondió ${res.status}`);
      return null;
    }
    const respuesta = (await res.json()) as RespuestaApi<Perfil>;
    return respuesta.data;
  } catch (err) {
    console.error("[perfil-api] fallo al conectar con la API de Laravel", err);
    return null;
  }
}
