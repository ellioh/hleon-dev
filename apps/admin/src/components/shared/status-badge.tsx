import { Badge } from "@/components/ui/badge";

/**
 * Reutilizable en cualquier módulo con el patrón borrador/publicado
 * (Experience, Blog, Servicios...) - un solo componente, no uno por
 * módulo. Acepta cualquier string para no acoplarse a los enums de
 * Proyecto específicamente.
 */
export function StatusBadge({ estado }: { estado: string }) {
  const mapa: Record<string, { label: string; variant: "success" | "secondary" | "warning" | "destructive" }> = {
    publicado: { label: "Publicado", variant: "success" },
    borrador: { label: "Borrador", variant: "secondary" },
    en_curso: { label: "En curso", variant: "warning" },
    completado: { label: "Completado", variant: "success" },
    mantenimiento: { label: "Mantenimiento", variant: "warning" },
    archivado: { label: "Archivado", variant: "secondary" },
  };

  const config = mapa[estado] ?? { label: estado, variant: "secondary" as const };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
