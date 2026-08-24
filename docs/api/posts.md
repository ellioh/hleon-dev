# API de Posts (Blog)

Tercer módulo sobre la arquitectura de referencia de Proyecto (ver [ADR 0006](../adr/0006-proyecto-arquitectura-referencia.md) y [ADR 0008](../adr/0008-blog-perfil-y-audiencia.md)). Backend: `backend/laravel`. Consumido por `apps/admin` (CRUD completo) y por `app/blog/*` en Next.js (solo lectura).

## Público (sin autenticación)

Solo devuelven posts con `publicado = true` y `fecha_publicacion <= ahora()` (permite programar publicaciones futuras, ver `Post::scopePublicados`).

### `GET /api/posts`

Listado paginado, forma resumida (`PostSummaryResource` — sin `contenido` ni `seo`, igual que Proyecto).

| Param | Tipo | Descripción |
|---|---|---|
| `busqueda` | string | Búsqueda libre por título/resumen |
| `categoria_id` | int | Filtra por categoría |
| `tipo_audiencia` | string | `consultoria` / `carrera_arquitectura` / `ambos` |
| `orden_por` | string | Default `fecha_publicacion` |
| `orden_direccion` | string | Default `desc` |
| `por_pagina` | int | Default 12, máximo 50 |

### `GET /api/posts/{slug}`

Detalle completo (`PostResource`). 404 si el slug no existe o no está publicado.

## Admin (requiere sesión Sanctum)

Mismo patrón CRUD que Proyecto (`/api/admin/posts`, paginado, con papelera vía `?papelera=1`). Endpoints de publicación: `POST /api/admin/posts/{post}/publicar` (falla 422 solo si el contenido nunca se completó — a diferencia de Proyecto, no exige narrativa adicional al publicar porque título/resumen/contenido/categoría ya son obligatorios desde la creación) y `despublicar`.

### `autor_id` no es un campo del formulario

Se resuelve del lado del servidor a partir del Perfil singleton (`PostService::crear`) — con un solo autor posible en todo el sistema, pedirlo en el formulario no tendría sentido. Si no existe Perfil, la creación falla con 422 (ver `docs/api/perfil.md`).

### `tipo_audiencia`

Campo nuevo (no existía en la Iteración 1): `consultoria` | `carrera_arquitectura` | `ambos`. Determina qué CTA se muestra al final del artículo según la estrategia de contenido dual (captar clientes de consultoría vs. reclutadores para el objetivo de trabajo remoto). El frontend público (`app/blog/[slug]`) todavía no ramifica el CTA por este campo — queda disponible en la API para cuando se implemente esa personalización.

### SEO y `contenido`

`seo` reutiliza el mismo sistema polimórfico que Proyecto (`ValidatesSeo`, `SeoResource`). `contenido` es markdown crudo (`mediumText`), renderizado en el sitio público con el mismo `lib/markdown.ts` que ya existía — sin editor WYSIWYG, el admin edita markdown en un `<textarea>` monoespaciado.

## Migración de contenido real

`database/seeders/PostSeeder.php` migra los 3 artículos reales de `data/posts.json` (contenido extraído byte a byte, no retranscrito) como `publicado = true` — a diferencia de `ProyectoSeeder`, este contenido ya estaba completo y en producción, no hay narrativa pendiente que justifique dejarlo en borrador. El seeder se salta por completo si no existe un Perfil (ver arriba).
