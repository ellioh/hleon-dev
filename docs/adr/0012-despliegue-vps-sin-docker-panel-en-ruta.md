# ADR 0012 — Despliegue en VPS sin Docker, panel en `hleon.dev/panel`

## Estado
Aceptado (2026-09-22)

## Contexto
El sitio se publicará en un VPS que ya opera otra web Laravel + React con
PHP 8.3, Node y MySQL instalados directamente. El `docker/docker-compose.yml`
(ADR 0005) levanta su propio MySQL y nginx, lo que en ese servidor duplicaría
servicios ya existentes. Además, el ADR 0004 dejó pendiente dónde vive el
panel de administración (se asumía `admin.hleon.dev`).

## Decisión
- **Sin Docker en producción:** instalación directa en `/var/www/hleon.dev`,
  con su propia base de datos y usuario en el MySQL existente, PHP-FPM para
  Laravel y PM2 para Next.js. Docker queda solo para desarrollo local.
- **Panel en `hleon.dev/panel`** en vez de un subdominio `admin.`: Vite compila
  con `base: '/panel/'` (solo en build) y el router usa `BASE_URL` como
  `basename`. nginx sirve `apps/admin/dist` por `alias` antes del proxy a Next.
- **API sigue en `api.hleon.dev`:** no se monta en `hleon.dev/api` porque
  Next.js ya usa ese prefijo (`app/api/contacto`, `app/api/admin/*`).
- Sanctum/CORS apuntan a `hleon.dev` y `SESSION_DOMAIN=.hleon.dev`, para que la
  cookie `XSRF-TOKEN` emitida por `api.hleon.dev` sea legible desde el panel.

Archivos de despliegue en `deploy/` (nginx, PM2, ejemplos de `.env`, script).

## Consecuencias
- (+) Un subdominio y un certificado menos; el panel comparte dominio con el sitio.
- (+) Sin segundo MySQL ni contenedores en un VPS compartido.
- (−) El despliegue depende de las versiones instaladas en el VPS (Node ≥ 20.9,
  MySQL ≥ 8.0.16 por los `CHECK`), no de imágenes fijadas.
- (−) `/panel` queda reservado: Next.js no debe definir una ruta con ese nombre.
- Resuelve la decisión pendiente del ADR 0004: el panel vive en este mismo repo
  (`apps/admin`) y se publica bajo el dominio principal.
