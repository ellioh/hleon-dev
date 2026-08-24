# ADR 0008 — Blog: Perfil como prerequisito, imagen destacada, y reutilización del patrón de referencia

## Estado
Aceptado — Vertical Slice #3 completo (2026-08-24)

## Contexto
Tercer módulo construido sobre la arquitectura de referencia de Proyecto ([ADR 0006](0006-proyecto-arquitectura-referencia.md)). A diferencia de Experiencia (sin página propia, ver [ADR 0007](0007-experiencia-sin-pagina-propia.md)), Post se parece más a Proyecto: tiene slug, página de detalle propia, SEO polimórfico, y split lista/detalle de Resources. La diferencia real y no anticipada fue `posts.autor_id`, una FK obligatoria a una tabla `perfil` (singleton) que hasta este slice no tenía modelo Eloquent ni ninguna interfaz.

## Decisiones

### 1. Perfil: modelo mínimo, no un módulo completo
`posts.autor_id` no admite null. En vez de fabricar una fila de relleno (violaría la política de no-fabricación) o modelar Perfil como un módulo completo con CRUD, se construyó lo mínimo necesario: un modelo Eloquent, `PerfilService::obtener()/guardar()` (upsert transparente sobre una tabla sin restricción de unicidad a nivel de BD - la unicidad es responsabilidad de la aplicación), un único endpoint admin (`GET`/`PUT /api/admin/perfil`), y una sola página "Mi perfil" en React Admin (un formulario, sin listado). `PostService::crear()` resuelve `autor_id` automáticamente a partir de este singleton - el formulario de Post nunca lo pide. Si Perfil no existe, crear un post falla con un 422 explícito, no con un error de integridad referencial oscuro.

### 2. Imagen destacada: sí se implementa (revierte una nota desactualizada de CLAUDE.md)
El esquema de `posts` (diseñado en la Fase 1, después de que `CLAUDE.md` documentara "Sin imágenes de posts" describiendo el sistema JSON anterior) ya incluía `imagen_destacada_id`. Se confirmó con el usuario antes de implementar: se agrega `ImageUploader` al formulario de Post, reutilizando el mismo componente y `MediaService` que Proyecto - sin código nuevo del lado de subida/redimensionado/WebP.

### 3. `tipo_audiencia` y el nombre de autor dinámico resuelven dos asuntos pendientes
- `tipo_audiencia` (`consultoria`/`carrera_arquitectura`/`ambos`) ya estaba en el esquema, reflejando la estrategia de contenido dual del proyecto (captar clientes vs. candidatura a trabajo remoto). Se expone en la API; el frontend público todavía no ramifica el CTA por este campo (ver `docs/api/posts.md`).
- El nombre del autor mostrado en `/blog` (cabecera del artículo, JSON-LD, `feed.xml`, página de inicio) dejó de estar hardcodeado como `"Héctor León"` y ahora viene de `post.autor.nombre` (resuelto desde Perfil vía `AutorResource`, una vista pública deliberadamente mínima que no expone email/bio larga/disponibilidad). Esto resuelve orgánicamente la discrepancia de nombre "Héctor León" vs. "Heli Leon Atiquipa" señalada al inicio del proyecto, sin que yo tuviera que decidirla: el nombre que aparece en el sitio es el que el usuario cargue en "Mi perfil".

### 4. Reutilización directa, sin cambios: SEO polimórfico, Categoria, patrón Repository/Service/Resource
`ValidatesSeo`, `SeoEditor`, el split `PostSummaryResource`/`PostResource`, el patrón de slug único, y `Categoria` (misma tabla que Proyecto) se usaron tal cual. `contenido` sigue siendo markdown renderizado por el `lib/markdown.ts` ya existente - no se agregó ningún editor WYSIWYG, manteniendo la decisión original de "sin librerías de UI externas" fuera de lo ya aprobado (Radix).

### 5. Slugs de categoría: se corrige un bug de URLs con acentos
El sistema anterior generaba URLs de categoría con el nombre en minúsculas sin normalizar (`/blog/categoria/consultor%C3%ADa`, con tilde codificada). Categoria ahora es una entidad real con `slug` propio (generado con `Str::slug`, sin acentos: `consultoria`). Las páginas de blog y sus enlaces se actualizaron para usar `categoria.slug` en vez de `categoria.nombre.toLowerCase()` - una corrección real, no solo una consecuencia de tener el campo disponible.

## Errores reales encontrados durante la construcción de este slice
1. **`publicado: null` en la respuesta al crear un post**: `Post::create($datos)` nunca fabricaba el atributo `publicado` en memoria cuando no venía en el payload (el formulario no lo envía a propósito, se maneja vía publicar/despublicar). Eloquent no relee los defaults de columna aplicados por la base de datos en el objeto recién creado, así que la respuesta JSON mostraba `null` en vez de `false` aunque la fila en BD ya tuviera `0` correctamente. Confirmado comparando con una relectura de BD antes de corregir. Corregido fijando `$datos['publicado'] ??= false` explícitamente en `PostService::crear()`, mismo patrón ya usado para `fecha_publicacion`.
2. **Colisión de `id` en el formulario de Post**: el `<Textarea>` de contenido usaba `id="contenido"`, el mismo id que `AppShell` usa para su landmark de "saltar al contenido" (`<main id="contenido">`, parte del enlace de accesibilidad "skip to content"). HTML inválido (id duplicado), rompía la asociación `<label for>` y el enfoque del skip-link. Corregido renombrando a `id="post-contenido"`.

## Consecuencias
- Cualquier módulo futuro que necesite un solo autor no vuelve a preguntar "¿qué usuario admin lo escribió?" - reutiliza Perfil de la misma forma.
- El patrón "campo obligatorio de FK que apunta a un singleton no construido todavía" queda documentado como algo a detectar temprano (revisar el esquema completo, no solo la tabla del módulo en curso) antes de empezar el siguiente módulo.
- Deuda explícita, no corregida en este slice: la sección "Proyectos destacados" y el resto de la portada (`app/page.tsx`) todavía lee `data/proyectos.json` vía `lib/data.ts` en vez de la API de Laravel (gap dejado por el slice de Proyecto, detectado ahora); `tipo_audiencia` no todavía ramifica el CTA público.
