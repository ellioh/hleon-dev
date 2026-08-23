# ADR 0002 — Autenticación con `node:crypto` nativo, sin librerías externas

## Estado
Superada por [ADR 0005](0005-migracion-laravel-nextjs-react-docker.md) (2026-07-30) — la auth real ahora es Laravel Sanctum (`backend/laravel`); `packages/auth` queda sin usar.

Aceptado — Iteración 1 (2026-07-29)

## Contexto
El esquema de auth anterior (documentado en la auditoría técnica) generaba
el token de sesión como `base64("secreto:timestamp")` sin firma
criptográfica, con un secreto por defecto público (`"default-secret-32-chars-min"`)
si la variable de entorno no estaba configurada. Cualquiera podía forjar
una cookie de administrador válida.

Las opciones evaluadas para el reemplazo: `bcrypt`/`argon2` + `jsonwebtoken`,
NextAuth (excluido explícitamente por instrucción del proyecto), o las
primitivas nativas de `node:crypto`.

## Decisión
- **Hash de contraseña:** `crypto.scrypt` (nativo desde Node 10.5), con
  salt aleatorio de 16 bytes y comparación con `timingSafeEqual`.
- **Sesión:** token `base64url(payload).hmac-sha256`, con `exp` (epoch
  segundos) verificado en cada request. `SESSION_SECRET` es obligatorio y
  sin valor por defecto — si falta o mide menos de 32 caracteres, el
  sistema falla explícitamente en vez de aceptar un secreto débil.

## Consecuencias
- (+) Cero dependencias nuevas para todo el módulo de auth.
- (+) El fallo "sin secreto configurado" es ruidoso (excepción), no
  silencioso como en el esquema anterior.
- (−) Sin rotación de claves ni revocación de sesiones individuales (solo
  expiración por tiempo) — aceptable para un solo usuario administrador;
  revisar si el futuro panel de clientes (ver escalabilidad, documento del
  CMS) requiere revocación por sesión.
