# ADR 0005 — Migración a Laravel (API) + Next.js (web, en Vercel) + React (admin) + Docker Compose

## Estado
Aceptado — Revisión de arquitectura (2026-07-30)

## Contexto
Tras completar la Iteración 1 (infraestructura de datos en TypeScript:
`packages/db`, `packages/types`, `packages/auth` sobre MySQL vía `mysql2`),
se evaluó migrar el backend a Laravel, manteniendo Next.js para el sitio
público y agregando un backoffice en React puro. Ver el documento
"Revisión de arquitectura" para el análisis completo de méritos, riesgos
y costo de retrabajo.

En ese momento no existía todavía ninguna interfaz de admin ni integración
del sitio público con la capa de datos — era el punto más barato posible
para cambiar de rumbo.

## Decisión
1. **Laravel** (`backend/laravel`) es el backend/API/CMS. Sustituye a
   `packages/db` (repositorios, servicios, cliente MySQL, runner de
   migraciones) y a `packages/auth` (hash y firma de sesión hechos a mano).
2. **Next.js** (futuro `apps/web`) sigue siendo el sitio público, y
   **sigue desplegándose en Vercel** - no entra al docker-compose. Next.js
   pasa a consumir la API de Laravel vía `fetch()` en vez de leer JSON o
   MySQL directamente (cambio que ocurre en la Fase 4, no en esta).
3. **React puro (Vite)** es el backoffice (futuro `apps/admin`), sin SSR
   por no necesitarlo nunca (está detrás de auth, bloqueado de indexación).
4. **Docker Compose** orquesta nginx + laravel-api + mysql, mismo archivo
   en desarrollo y producción (paridad dev/prod). Se agrega `react-admin`
   como cuarto servicio en la Fase 3, cuando `apps/admin` exista.

## Por qué
- Laravel es el stack de producción real del autor (3 de 4 proyectos del
  portafolio actual), a diferencia de un backend TypeScript donde la
  profundidad se estaba construyendo recién. Para el objetivo de conseguir
  trabajo remoto como Senior Systems Analyst, demostrar arquitectura en el
  stack de mayor dominio real es una señal más fuerte.
- Eloquent es el patrón idiomático de Laravel - adoptarlo resuelve, en vez
  de perpetuar, la tensión de "repositorios a mano sin ORM" que existía en
  `packages/db` únicamente por evitar Prisma en un contexto TypeScript.
- Next.js en Vercel no gana nada entrando a Docker: seguía funcionando con
  cero operación en cada push, y mover esa pieza específica solo cambia
  una plataforma gratuita y ya resuelta por una que hay que operar.

## Consecuencias
- **Retrabajo cuantificado**: ~1,600 líneas de TypeScript de la Iteración 1
  (`packages/db/src/repositories`, `packages/db/src/services`,
  `packages/db/src/client.ts`/`migrate.mjs`, `packages/auth`) quedan
  obsoletas como código - permanecen en el repositorio sin eliminarse
  todavía (decisión explícita: no se borra código funcionando sin una
  confirmación aparte), pero no se usan.
- **Se conserva íntegro**: el diseño de 26 tablas (`packages/db/migrations/*.sql`),
  portado mecánicamente a Laravel Schema Builder
  (`backend/laravel/database/migrations/*.php`) con los mismos nombres,
  relaciones y reglas `CHECK`. Las interfaces de `packages/types` sobreviven
  como referencia del contrato de datos.
- **Un servicio más que operar** (Laravel + MySQL + nginx en el VPS, vía
  Docker Compose) a cambio de mantener Next.js exactamente donde ya
  funcionaba bien.
- Esta ADR **supersede parcialmente** la ADR 0001 (sin ORM) y la ADR 0002
  (auth nativa en TypeScript): ambas decisiones siguen siendo válidas para
  el contexto en que se tomaron, pero dejan de aplicar al backend real del
  proyecto a partir de esta migración.
