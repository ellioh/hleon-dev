# API de Servicios

Cuarto módulo sobre la arquitectura de referencia de Proyecto (ver [ADR 0006](../adr/0006-proyecto-arquitectura-referencia.md) y [ADR 0009](../adr/0009-servicios-sin-flujo-de-publicacion.md)). Backend: `backend/laravel`. Consumido por `apps/admin` (CRUD completo) y por `app/servicios/*` + la sección `#servicios` del home en Next.js (solo lectura).

## Público (sin autenticación)

Solo devuelven servicios con `visible = true`. **Sin `estado_publicacion`/`publicado`** — a diferencia de Proyecto/Post/Experiencia, Servicio no tiene flujo de borrador/publicado (ver ADR 0009).

### `GET /api/servicios`

Listado paginado, forma resumida (`ServicioSummaryResource` — sin `descripcionCompleta`/`entregables`/`proyectoEjemplo`/`seo`).

| Param | Tipo | Descripción |
|---|---|---|
| `busqueda` | string | Búsqueda libre por nombre/resumen breve |
| `categoria_id` | int | Filtra por categoría |
| `orden_por` | string | Default `orden` |
| `orden_direccion` | string | Default `asc` |
| `por_pagina` | int | Default 12, máximo 50 |

### `GET /api/servicios/{slug}`

Detalle completo (`ServicioResource`). 404 si el slug no existe o no está visible.

**`proyectoEjemplo` se enmascara si el proyecto vinculado no está publicado, no es visible, o es confidencial** (`ServicioService::enmascarar`, mismo patrón que la confidencialidad de Proyecto) — sin esto, un servicio público podría filtrar la existencia de un proyecto todavía en borrador solo por estar enlazado como ejemplo. Verificado con un caso real durante este slice: un servicio enlazado a uno de los 4 proyectos (todos en borrador) correctamente no muestra `proyectoEjemplo` en la respuesta pública, aunque sí lo ve el admin.

## Admin (requiere sesión Sanctum)

Mismo patrón CRUD que Proyecto, **sin `publicar`/`despublicar`**: `visible` se cambia con un `PUT` normal como cualquier otro campo.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/servicios` | Listado admin (paginado, incluye no visibles) |
| POST | `/servicios` | Crear |
| GET | `/servicios/{servicio}` | Detalle (incluye eliminados vía `withTrashed`) |
| PUT | `/servicios/{servicio}` | Actualizar (incluye cambiar `visible`) |
| DELETE | `/servicios/{servicio}` | Soft delete |
| POST | `/servicios/{id}/restaurar` | Restaurar de la papelera |

### Validación de precio

`rango_precio_max` debe ser `>= rango_precio_min` (regla `gte`). `moneda` es obligatoria si se especifica cualquiera de los dos precios (`required_with`). Ambas reglas viven solo en el backend (Form Request), no duplicadas en el frontend — mismo criterio que el resto de reglas de negocio de este proyecto.

### `entregables`

Lista de texto libre (`{ texto, orden }`), mismo patrón que `experiencia_logros` — se reemplaza completa en cada guardado (`ServicioService::sincronizarEntregables`).

### `proyecto_ejemplo_id`

FK opcional a un solo Proyecto (a diferencia del multi-select `proyecto_ids` de Experiencia). El admin ve el proyecto completo sin enmascarar; el público solo si está publicado/visible/no confidencial (ver arriba).

## Migración de contenido real

`database/seeders/ServicioSeeder.php` migra los 6 servicios reales que estaban hardcodeados en la sección `#servicios` de `app/page.tsx` (nombre, ícono, resumen breve — contenido real y ya en producción), como `visible = true`. `descripcion_completa` (campo nuevo, no existía en el array anterior) se deja igual al resumen breve — no se fabrica una versión expandida.
