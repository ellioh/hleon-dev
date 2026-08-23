# API de Proyectos

Módulo de referencia (ver [ADR 0006](../adr/0006-proyecto-arquitectura-referencia.md)). Backend: `backend/laravel`. Consumido por `apps/admin` (CRUD completo) y por el sitio público (`app/portafolio/*`, solo lectura).

## Público (sin autenticación)

Solo devuelven proyectos con `estado_publicacion = 'publicado'` y `visible = true`. Si `es_confidencial` es `true`, el campo `organizacion` se oculta (`null`) — la existencia de un cliente confidencial no debe filtrarse ni en el detalle público.

### `GET /api/proyectos`

Listado paginado, forma resumida (`ProyectoSummaryResource` — sin `elDesafio`/`laSolucion`/`miRol`/`resultados`/`galeria`/`videos`/`seo`, que solo pesan en el detalle).

Query params:
| Param | Tipo | Descripción |
|---|---|---|
| `busqueda` | string | Búsqueda libre por nombre/resumen |
| `categoria_id` | int | Filtra por categoría |
| `tecnologia_id` | int | Filtra por tecnología |
| `destacado` | bool | Solo destacados |
| `orden_por` | string | Default `orden` |
| `orden_direccion` | string | `asc`/`desc`, default `asc` |
| `por_pagina` | int | Default 12, máximo 50 |

Respuesta: colección paginada de Laravel (`data`, `links`, `meta`).

### `GET /api/proyectos/{slug}`

Detalle completo (`ProyectoResource`). 404 si el slug no existe o el proyecto no está publicado. Incluye `seo` (puede ser `null` si el admin no configuró SEO para ese proyecto — el consumidor debe tener fallback, ver `lib/proyectos-api.ts` en `apps/web`).

### `GET /api/categorias`, `GET /api/tecnologias`

Listados completos, sin paginar, para poblar filtros.

## Admin (requiere sesión Sanctum — cookie, no token)

Todas bajo `/api/admin`, middleware `auth:sanctum`. Devuelven 401 si no hay sesión activa.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/proyectos` | Listado admin (incluye borradores) |
| POST | `/proyectos` | Crear |
| GET | `/proyectos/{proyecto}` | Detalle (incluye eliminados vía `withTrashed`) |
| PUT | `/proyectos/{proyecto}` | Actualizar |
| DELETE | `/proyectos/{proyecto}` | Soft delete |
| POST | `/proyectos/{id}/restaurar` | Restaurar de la papelera |
| POST | `/proyectos/{proyecto}/publicar` | Publicar — falla (422) si `el_desafio`/`la_solucion`/`mi_rol` están vacíos |
| POST | `/proyectos/{proyecto}/despublicar` | Volver a borrador |
| PUT | `/proyectos/{proyecto}/galeria` | Sincroniza el orden/contenido de la galería (`media_ids_ordenados`) |
| POST | `/media` | Sube una imagen (redimensiona a 1920px máx, recodifica a WebP calidad 82) |
| DELETE | `/media/{media}` | Elimina una imagen |
| GET / POST | `/organizaciones` | Listado/creación — deliberadamente **no público**: exponer esta ruta filtraría qué organizaciones existen aunque el proyecto asociado sea confidencial |

## Autenticación (contexto)

`POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` — Sanctum SPA (cookie httpOnly), no tokens Bearer. El cliente debe pedir primero `GET /sanctum/csrf-cookie` y mandar el header `X-XSRF-TOKEN` con el valor de la cookie `XSRF-TOKEN` **decodificado** (URL-decode) en cada mutación. Ver `apps/admin/src/lib/api.ts::ensureCsrfCookie()`.

## Variables de entorno relevantes

| Variable | Dónde | Uso |
|---|---|---|
| `LARAVEL_API_URL` | raíz del monorepo (`.env.local`/`.env.example`) | Next.js — base URL para `lib/proyectos-api.ts` y `next.config.ts` (`images.remotePatterns`) |
| `VITE_API_URL` (o equivalente) | `apps/admin` | React Admin — base URL para `src/lib/api.ts` |
| `APP_URL` | `backend/laravel/.env` | Laravel — debe coincidir con el puerto real donde corre el servidor (`php artisan serve --port=...`), porque `MediaService` genera URLs absolutas de imagen a partir de este valor |
