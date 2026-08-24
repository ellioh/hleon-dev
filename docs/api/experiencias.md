# API de Experiencia

Segundo módulo construido sobre la arquitectura de referencia de Proyectos (ver [ADR 0006](../adr/0006-proyecto-arquitectura-referencia.md) y [ADR 0007](../adr/0007-experiencia-sin-pagina-propia.md)). Backend: `backend/laravel`. Consumido por `apps/admin` (CRUD completo) y por `app/trayectoria` (solo lectura, lista completa — sin páginas de detalle).

## Público (sin autenticación)

### `GET /api/experiencias`

Lista completa (sin paginar — ver ADR 0007) de experiencias con `estado_publicacion = 'publicado'` y `visible = true`, ordenadas por `fecha_inicio DESC, orden ASC` (más reciente primero). Forma única (`ExperienciaResource`, sin split lista/detalle).

No existe `GET /api/experiencias/{id|slug}`: a diferencia de Proyecto, Experiencia no tiene página pública propia por entrada.

## Admin (requiere sesión Sanctum)

Todas bajo `/api/admin/experiencias`, mismo patrón de autenticación que Proyecto (ver `docs/api/proyectos.md`).

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/experiencias` | Listado admin (incluye borradores, sin paginar) |
| POST | `/experiencias` | Crear |
| GET | `/experiencias/{experiencia}` | Detalle (incluye eliminados vía `withTrashed`) |
| PUT | `/experiencias/{experiencia}` | Actualizar |
| DELETE | `/experiencias/{experiencia}` | Soft delete |
| POST | `/experiencias/{id}/restaurar` | Restaurar de la papelera |
| POST | `/experiencias/{experiencia}/publicar` | Publicar — falla (422) si `resumen`/`descripcion` están vacíos |
| POST | `/experiencias/{experiencia}/despublicar` | Volver a borrador |

Payload de creación/actualización acepta `tecnologia_ids: number[]`, `proyecto_ids: number[]` (vincula con Proyectos del portafolio) y `logros: string[]` (se reemplazan completos en cada guardado, no se hace diff — ver `ExperienciaService::sincronizarLogros`).

### Regla de negocio: `actual` y `fecha_fin`

Portada tal cual de la Iteración 1 (`packages/db/src/services/ExperienciaService.ts`, nunca implementada en la API hasta este módulo):
- Si `actual = true`, `fecha_fin` debe ser `null`.
- Si `actual = false` y hay `fecha_fin`, debe ser posterior a `fecha_inicio`.

Validada en dos capas: `Store/UpdateExperienciaRequest` (`prohibited_if:actual,true` + `after:fecha_inicio`, cubre creación y actualización completa) y `ExperienciaService::validarFechas` (cubre actualizaciones parciales, donde el Form Request no ve el estado combinado con lo ya guardado).

## `GET/POST /api/admin/organizaciones?tipo=`

Extendido en este módulo (antes no filtraba). `tipo` acepta `cliente`/`empleador`/`ambos`; el filtro siempre incluye además las organizaciones de tipo `ambos`. Usado por `OrganizacionSelector` en `apps/admin` para separar clientes (Proyecto) de empleadores (Experiencia) sin duplicar la tabla.
