# ADR 0004 — Monorepo con `packages/*`, sin dividir `apps/` todavía

## Estado
Aceptado — Iteración 1 (2026-07-29)

**Actualización (2026-07-30, ver [ADR 0005](0005-migracion-laravel-nextjs-react-docker.md)):** el mismo principio incremental aplicó a `backend/laravel` y `docker/` - se agregaron como carpetas nuevas junto a `packages/*`, sin mover ni reestructurar nada existente. `apps/web`+`apps/admin` se mantiene diferido a la Fase 3.

## Contexto
La arquitectura final contempla dos aplicaciones (`hleon.dev` y
`admin.hleon.dev`). La Iteración 1 solo construye la capa de datos —
ninguna interfaz gráfica todavía.

## Decisión
Se agregan `packages/db`, `packages/types` y `packages/auth` como
workspaces npm (`"workspaces": ["packages/*"]` en el `package.json` raíz),
sin mover `app/`, `lib/` ni `data/` a una carpeta `apps/web/`. El sitio
público actual sigue intacto, leyendo los JSON exactamente como antes.

La división en `apps/web` + `apps/admin` se pospone a la Iteración 3
(cuando exista una segunda aplicación Next.js real que la justifique) para
no reestructurar el repositorio dos veces ni arriesgar el sitio en
producción con un cambio estructural que esta iteración no necesita.

## Consecuencias
- (+) Cero riesgo sobre el sitio público actual en esta iteración.
- (+) `packages/db`/`types`/`auth` quedan listos para ser consumidos por
  ambas aplicaciones futuras sin duplicar código.
- (−) Decisión pendiente y explícitamente diferida: si `admin.hleon.dev`
  vivirá en el mismo repositorio (como `apps/admin`) o en uno separado —
  se resuelve al iniciar la Iteración 3, no antes.
