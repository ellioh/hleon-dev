# API de Perfil

Singleton — prerequisito real de Blog (ver [ADR 0008](../adr/0008-blog-perfil-y-audiencia.md)). Desde [ADR 0011](../adr/0011-educacion-y-cv-bilingue-hire-me.md) también tiene consumidor público: `/hire-me` (el CV en inglés).

## Público (sin autenticación)

### `GET /api/perfil`

Devuelve el mismo `PerfilResource` que el endpoint de admin, o `{"data": null}` si el perfil todavía no se guardó nunca. Sin auth — todos los campos de Perfil son información profesional pensada para mostrarse públicamente (nombre, título, bio, contacto, disponibilidad).

## Admin (requiere sesión Sanctum)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/admin/perfil` | Devuelve el perfil, o `{"data": null}` si todavía no se guardó nunca |
| PUT | `/api/admin/perfil` | Crea la primera vez, actualiza después (upsert transparente, ver `PerfilService::guardar`) |

Todos los campos son obligatorios en cada guardado (`PerfilRequest` no usa `sometimes` — es un único formulario que siempre envía todo, sin actualización parcial real). Excepción: `titulo_profesional_en`/`bio_larga_en` (agregados en ADR 0011) son nullable — insumo de `/hire-me`, si faltan esa sección simplemente no aparece ahí.

## Por qué existe

`posts.autor_id` es una FK obligatoria a `perfil`. No se fabrica una fila con datos de relleno para desbloquear Blog — mientras `Perfil::first()` sea `null`, `POST /api/admin/posts` devuelve 422 (`autor_id: "Completa tu perfil..."`) y `PostSeeder` se salta con un aviso. Completar "Mi perfil" en el admin es el único camino para crear el primer artículo.
