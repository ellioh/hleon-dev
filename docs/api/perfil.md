# API de Perfil

Singleton — prerequisito real de Blog (ver [ADR 0008](../adr/0008-blog-perfil-y-audiencia.md)). Sin modelo público todavía: nada en el sitio consume Perfil directamente (una futura página "Acerca de" sería el consumidor natural, no construida en este slice).

## Admin (requiere sesión Sanctum)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/admin/perfil` | Devuelve el perfil, o `{"data": null}` si todavía no se guardó nunca |
| PUT | `/api/admin/perfil` | Crea la primera vez, actualiza después (upsert transparente, ver `PerfilService::guardar`) |

Todos los campos son obligatorios en cada guardado (`PerfilRequest` no usa `sometimes` — es un único formulario que siempre envía todo, sin actualización parcial real).

## Por qué existe

`posts.autor_id` es una FK obligatoria a `perfil`. No se fabrica una fila con datos de relleno para desbloquear Blog — mientras `Perfil::first()` sea `null`, `POST /api/admin/posts` devuelve 422 (`autor_id: "Completa tu perfil..."`) y `PostSeeder` se salta con un aviso. Completar "Mi perfil" en el admin es el único camino para crear el primer artículo.
