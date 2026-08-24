import type { Perfil } from "@/types/api";
import type { PerfilFormValues } from "@/features/perfil/perfil-schema";

export function perfilToFormValues(p: Perfil): PerfilFormValues {
  return {
    nombre_completo: p.nombreCompleto,
    nombre_publico: p.nombrePublico,
    titulo_profesional: p.tituloProfesional,
    bio_corta: p.bioCorta,
    bio_larga: p.bioLarga,
    foto_media_id: p.foto?.id ?? null,
    email: p.email,
    ubicacion: p.ubicacion,
    nivel_ingles: p.nivelIngles,
    disponibilidad: p.disponibilidad,
    mensaje_disponibilidad: p.mensajeDisponibilidad,
    anos_experiencia: p.anosExperiencia,
  };
}
