# ADR 0006 — Proyecto (Projects) como arquitectura de referencia del Vertical Slice

## Estado
Aceptado — Vertical Slice #1 completo (2026-08-23)

## Contexto
Tras [ADR 0005](0005-migracion-laravel-nextjs-react-docker.md), se decidió
construir cada módulo del CMS como un **vertical slice** completo (Laravel
+ React Admin + Next.js) en vez de avanzar capa por capa. **Proyectos** fue
elegido como el primer slice, con el mandato explícito de tratarlo como
**la arquitectura de referencia** para los módulos futuros (Experiencia,
Blog, Servicios, Certificaciones): antes de construirlo se generalizaron
cinco piezas para que fueran reutilizables desde el día uno — `Cliente` →
`Organizacion`, `Media`/galerías/video-embeds como sistema polimórfico,
`Tecnologia` como entidad completa (no strings sueltos), SEO polimórfico
(`robots`/`canonical`/OG/Twitter), y el propio `Proyecto` como plantilla
de qué es específico del módulo vs. qué es genérico.

Este ADR documenta qué quedó como patrón reutilizable y qué es específico
de Proyectos, para que el siguiente módulo (cuando se apruebe empezarlo)
copie lo primero y no lo segundo.

## Decisión

### Reutilizable tal cual (Laravel)
- **`Organizacion`** (`app/Models/Organizacion.php`) — reemplaza cualquier
  futuro `Cliente`/`Empleador` puntual. Expone `nombreVisible` (accesor
  `nombre_publico ?: nombre`) para que el consumidor público nunca necesite
  saber si el nombre mostrado es el real o uno anonimizado.
- **Sistema de Media** — `Media` (modelo) + `MediaService`
  (`app/Services/MediaService.php`, redimensiona a 1920px máx sin
  agrandar, recodifica a WebP calidad 82) + dos tablas polimórficas:
  `media_galeria` (`morphToMany`, con `orden` en el pivot) y
  `videos_embebidos` (`morphMany`). Cualquier modelo futuro solo necesita
  declarar `galeria()`/`videos()` con el mismo `morphTo`/`morphMany`
  apuntando a su propio nombre de tabla — no hay que tocar `MediaService`.
- **`Tecnologia`** como entidad completa (slug, categoría, icono, logo,
  color de acento) en vez de strings libres — reutilizable por cualquier
  módulo que necesite listar stack técnico (Experiencia, Servicios).
- **SEO polimórfico** — tabla `seo_metadata` (`seo_optionable_type/_id`),
  modelo `Seo`, trait `ValidatesSeo`
  (`app/Http/Requests/Concerns/ValidatesSeo.php`) con ~12 reglas de
  validación reutilizables vía `reglasSeo()`, y `SeoResource`. Un módulo
  nuevo solo agrega `seo()` (`morphOne(Seo::class, 'seo_optionable')`,
  **con el nombre de morph explícito** — ver "Errores reales" abajo) a su
  modelo y usa el trait en su Form Request.
- **Patrón Repository + Service** — Repository centraliza construcción de
  queries (filtros/búsqueda/orden/paginación vía constantes
  `RELACIONES_LISTADO`/`RELACIONES_DETALLE`); Service centraliza reglas de
  negocio (slug único, validación de publicación, enmascarado de
  confidencialidad, sincronización de galería).
- **Soft delete + `estado_publicacion`** — dos conceptos separados
  deliberadamente: `eliminado_en` (papelera/restaurar) es independiente de
  `estado_publicacion` (`borrador`/`publicado`, visible solo al público
  cuando está publicado). Un registro puede estar publicado y eliminado
  (papelera) sin contradicción.
- **API Resources con forma lista vs. detalle** —
  `{Modulo}SummaryResource` (liviano, para listados) vs.
  `{Modulo}Resource` (completo, incluye narrativa/relaciones pesadas). Ver
  `ProyectoSummaryResource`/`ProyectoResource` como plantilla exacta.
- **Policy con gate único** — todas las habilidades gateadas en una sola
  condición (`$user->activo && in_array($user->rol, [...])`), no una regla
  distinta por acción salvo que el módulo la necesite genuinamente.

### Reutilizable como patrón (apps/admin, no como código compartido — ver "Deuda" abajo)
- **Piezas UI genéricas** (`src/components/shared/`): `data-table.tsx`
  (tabla genérica `<T>` con loading/error/empty ya resueltos),
  `confirm-dialog.tsx`, `status-badge.tsx`, `empty-state.tsx`,
  `error-state.tsx`, `loading-state.tsx`, `pagination.tsx`,
  `search-input.tsx` (debounced), `data-toolbar.tsx`,
  `form-section.tsx` (`FormSection`/`FormField`), `image-uploader.tsx`,
  `gallery-uploader.tsx`, `category-selector.tsx`,
  `technology-selector.tsx`, y el más específico pero completamente
  reutilizable **`seo-editor.tsx`** (usa `useFormContext` de
  `react-hook-form`, así que se inserta en cualquier formulario que envuelva
  sus campos en `FormProvider` sin acoplarse al schema del módulo que lo usa).
- **Primitivas de diseño** (`src/components/ui/`): shadcn-pattern sobre
  Radix (button/input/textarea/label/select/checkbox/badge/card/dialog/
  tabs/table/skeleton/alert/dropdown-menu) + tokens OKLCH en
  `src/index.css` — es el design system completo, no hay que rehacerlo.
- **Hooks**: `use-auth.tsx`, `use-lookups.ts` (categorías/tecnologías),
  `use-upload-image.ts`.
- **Cliente HTTP**: `src/lib/api.ts` (manejo de CSRF de Sanctum,
  `ApiError`), `src/lib/query-client.ts` (retry inteligente).
- **Layout**: `app-shell.tsx` + `sidebar-nav.tsx` + `protected-route.tsx`
  — sidebar fijo en desktop, cajón (`Dialog`) en móvil; un módulo nuevo
  solo agrega su entrada de navegación.
- **Patrón de formulario tabulado**: `proyecto-form-page.tsx` como
  plantilla — pestañas General / [narrativa del módulo] / relaciones /
  Medios / SEO / Publicación, con `FormProvider` envolviendo todo el form
  para que `SeoEditor` funcione sin props explícitos.

### Reutilizable como patrón (apps/web / Next.js)
- **`lib/proyectos-api.ts`** como plantilla de cliente de API pública:
  server-only (sin prefijo `NEXT_PUBLIC_`), `fetch` con `next: {revalidate}`
  para ISR, y **toda función devuelve `[]`/`null` en vez de lanzar** ante
  cualquier fallo de red — decisión deliberada porque Laravel corre en
  infraestructura separada (VPS, hoy sin URL pública) y un fallo ahí nunca
  debe tumbar el build o el render de Vercel.
- **Patrón de página de detalle**: `generateStaticParams` +
  `generateMetadata` (con fallback cuando `seo` es `null`, y `title:
  {absolute: ...}` cuando el admin definió un título SEO propio — ver
  "Errores reales") + JSON-LD (tipo de contenido + `BreadcrumbList`) +
  breadcrumbs + `notFound()` para slugs no publicados/inexistentes +
  sección de relacionados + inclusión en `sitemap.ts`.

## Errores reales encontrados durante la construcción de este slice
(Documentados aquí porque son errores de patrón, no de este módulo — el
siguiente módulo que copie estos patrones debe evitarlos desde el inicio.)

1. **Morphs con nombre de método camelCase**: Eloquent infiere las
   columnas `{nombre}_type`/`_id` del **nombre del método**, no de una
   versión snake_case automática. `seoOptionable()` generaba
   `seoOptionable_type` en vez de `seo_optionable_type` (columna real) →
   500 en SQL. Siempre pasar el nombre de morph explícito:
   `$this->morphTo('seo_optionable')`.
2. **Título SEO duplicado**: el layout raíz de Next.js ya aplica una
   plantilla `title: {template: "%s | hleon.dev"}`. Las páginas de detalle
   no deben concatenar el sufijo a mano — deben devolver el título plano
   (para que la plantilla lo agregue) o `{absolute: tituloPersonalizado}`
   cuando el valor viene de un campo SEO editable por el admin y debe
   mostrarse tal cual.
3. **`camelCase` (TS) vs `snake_case` (Laravel) en SEO**: el formulario de
   React usa camelCase para consistencia con el resto del código TS, pero
   `ValidatesSeo` valida snake_case. Resuelto con un único punto de
   conversión explícito (`seo-payload.ts::seoFormToPayload()`), usado solo
   al enviar — nunca se propaga snake_case al resto del frontend.

## Deuda técnica reconocida (explícita, no accidental)
- **Tipos duplicados**: `apps/admin/src/types/api.ts` y
  `lib/proyectos-api.ts` (en la raíz, para Next.js) definen formas de
  Proyecto/Media/Seo/etc. por separado, en vez de compartir un solo
  contrato. `packages/types` (creado en la Iteración 1, ver ADR 0005)
  sería el lugar natural, pero sus tipos actuales describen el esquema
  *anterior* a la migración a Laravel (sin `Organizacion`, sin SEO
  polimórfico) y quedaron obsoletos junto con `packages/db`. Consolidar
  ahí requeriría reescribir `packages/types` primero — se deja pendiente
  explícitamente en vez de hacerlo a medias dentro de este slice.
- **`npm run lint` roto en la raíz**: `next lint` fue removido en
  Next.js 16; el script (`"lint": "next lint"`) y la dependencia
  `eslint-config-next@15.3.3` quedaron de una versión anterior. No se
  corrigió en este slice (requiere decidir/autorear un `eslint.config.js`
  nuevo y revisar cuánta deuda de lint preexistente expone en todo el
  repo). `apps/admin` sí tiene ESLint 9 flat-config funcional y limpio.
- **Laravel sin URL pública**: el backend solo corre local
  (`localhost:8123`) o eventualmente en el VPS vía Docker Compose (ADR
  0005), que todavía no se desplegó. `/portafolio` en producción
  (Vercel) mostrará el estado vacío hasta que `LARAVEL_API_URL` apunte a
  una API real y alcanzable.

## Consecuencias
- El siguiente módulo (Experiencia, Blog, Servicios o Certificaciones —
  no empezar sin aprobación explícita, ver reglas del proyecto) puede
  reutilizar directamente: `Organizacion`, el sistema de Media/galería/
  video, `Tecnologia`, SEO polimórfico + `ValidatesSeo`, el patrón
  Repository/Service, `{Modulo}SummaryResource`/`{Modulo}Resource`, y en
  el frontend prácticamente todo `components/shared` y `components/ui`
  sin modificar.
- Lo específico de Proyectos que **no** debe copiarse literalmente:
  `el_desafio`/`la_solucion`/`mi_rol`/`arquitectura`/`retos`/
  `aprendizajes` (campos de caso de estudio, no genéricos) y
  `ProyectoResultado` (métricas de resultado) — cada módulo futuro define
  su propia narrativa relevante.
