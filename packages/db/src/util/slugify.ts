/**
 * Función pura, sin `fs` - vive fuera de cualquier repositorio a propósito
 * para que tanto servicios de servidor como formularios de cliente puedan
 * importarla sin arrastrar una dependencia de base de datos (corrige la
 * triplicación de `slugify()` señalada en la auditoría técnica).
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
