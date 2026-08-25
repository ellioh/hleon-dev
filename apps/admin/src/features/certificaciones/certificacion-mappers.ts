import type { Certificacion } from "@/types/api";
import type { CertificacionFormValues } from "@/features/certificaciones/certificacion-schema";

export function certificacionToFormValues(c: Certificacion): CertificacionFormValues {
  return {
    nombre: c.nombre,
    emisor: c.emisor,
    fecha_obtencion: c.fechaObtencion,
    fecha_expiracion: c.fechaExpiracion,
    credencial_id: c.credencialId,
    url_verificacion: c.urlVerificacion,
    imagen_insignia_id: c.imagenInsignia?.id ?? null,
    destacado: c.destacado,
    visible: c.visible,
    orden: c.orden,
  };
}
