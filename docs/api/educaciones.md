# API de Educación

Sexto módulo, mismo patrón "simple" que Certificacion (ver [ADR 0010](../adr/0010-certificaciones-el-modulo-mas-simple.md) y [ADR 0011](../adr/0011-educacion-y-cv-bilingue-hire-me.md)). Backend: `backend/laravel`. Consumido por `apps/admin` (CRUD completo), por la sección "Educación" de `app/trayectoria` (solo lectura) y por `app/hire-me` (solo lectura, filtrado por `tituloEn`).

## Público (sin autenticación)

### `GET /api/educaciones`

Lista completa (sin paginar, mismo criterio que Certificacion/Experiencia) de estudios con `visible = true`, ordenados por `fecha_inicio DESC, orden ASC`. Forma única (`EducacionResource`).

**Sin `GET /api/educaciones/{id}`**: sin slug, sin página propia — es insumo de `/trayectoria` y `/hire-me`, igual que Certificacion.

## Admin (requiere sesión Sanctum)

Mismo patrón CRUD que Certificacion (sin publicar/despublicar — `visible` se cambia con un `PUT` normal).

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/educaciones` | Listado admin (sin paginar, incluye no visibles) |
| POST | `/educaciones` | Crear |
| GET | `/educaciones/{educacion}` | Detalle (incluye eliminados vía `withTrashed`) |
| PUT | `/educaciones/{educacion}` | Actualizar (incluye cambiar `visible`) |
| DELETE | `/educaciones/{educacion}` | Soft delete |
| POST | `/educaciones/{id}/restaurar` | Restaurar de la papelera |

### `en_curso` y `fecha_fin`

Mutuamente excluyentes, mismo patrón que `actual`/`fecha_fin` en Experiencia: si `en_curso = true`, `fecha_fin` debe ser `null` (`prohibited_if:en_curso,true` en el Form Request + `EducacionService::validarFechas` para actualizaciones parciales). A diferencia de Experiencia, no hay validación de orden `fecha_fin > fecha_inicio` — no existe ese `CHECK` en la tabla.

### `titulo_en`

Único campo traducido — insumo de `/hire-me`. Nullable; si está vacío, ese estudio simplemente no aparece en `/hire-me` (nunca se muestra `titulo` en español como respaldo, ver ADR 0011). `institucion` no se traduce — son nombres propios.

## Contenido inicial

Sin seeder: como Certificacion, no existía ningún registro de educación en el sitio anterior. El esquema (`educaciones`, Fase 1) existía desde antes de este módulo pero nunca se había implementado — sin modelo, sin controller, sin UI hasta ahora.
