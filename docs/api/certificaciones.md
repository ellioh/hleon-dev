# API de Certificaciones

Quinto y más simple módulo sobre la arquitectura de referencia de Proyecto (ver [ADR 0006](../adr/0006-proyecto-arquitectura-referencia.md) y [ADR 0010](../adr/0010-certificaciones-el-modulo-mas-simple.md)). Backend: `backend/laravel`. Consumido por `apps/admin` (CRUD completo) y por la sección "Certificaciones" de `app/trayectoria` en Next.js (solo lectura).

## Público (sin autenticación)

### `GET /api/certificaciones`

Lista completa (sin paginar, mismo criterio que Experiencia) de certificaciones con `visible = true`, ordenadas por `fecha_obtencion DESC, orden ASC`. Forma única (`CertificacionResource`).

**Sin `GET /api/certificaciones/{id}`**: sin slug, sin página propia — es insumo de `/trayectoria`, igual que Experiencia.

## Admin (requiere sesión Sanctum)

Mismo patrón CRUD que Servicio (sin publicar/despublicar — `visible` se cambia con un `PUT` normal).

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/certificaciones` | Listado admin (sin paginar, incluye no visibles) |
| POST | `/certificaciones` | Crear |
| GET | `/certificaciones/{certificacion}` | Detalle (incluye eliminados vía `withTrashed`) |
| PUT | `/certificaciones/{certificacion}` | Actualizar (incluye cambiar `visible`) |
| DELETE | `/certificaciones/{certificacion}` | Soft delete |
| POST | `/certificaciones/{id}/restaurar` | Restaurar de la papelera |

### `fecha_expiracion`

Nullable — `null` significa "no expira" (certificación permanente), no una fecha pendiente de completar. Si se especifica, debe ser posterior a `fecha_obtencion` (`after:fecha_obtencion`). Sin interacción con otro campo (a diferencia de `actual`/`fecha_fin` en Experiencia) — la nulabilidad ya encierra el caso "no expira" sin necesitar un booleano aparte.

### Sin campos que otros módulos sí tienen

Sin `categoria_id`, sin descripción larga, sin SEO, sin slug. Solo `imagen_insignia_id` (FK a `media`, reutiliza `ImageUploader` sin cambios) como campo "pesado".

## Contenido inicial

Sin seeder: a diferencia de Proyecto/Blog/Servicios, no existía ninguna certificación real en el sitio anterior que migrar. El módulo nace vacío — se completa por primera vez desde el admin.
