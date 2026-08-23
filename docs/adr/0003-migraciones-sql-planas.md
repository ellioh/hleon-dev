# ADR 0003 — Migraciones como archivos `.sql` + runner propio

## Estado
Aceptado — Iteración 1 (2026-07-29)

## Contexto
Se necesita versionar el esquema de 26 tablas y poder aplicarlo de forma
repetible en distintos entornos (local, VPS de producción). Las opciones
evaluadas: un framework de migraciones (`db-migrate`, `node-pg-migrate` y
equivalentes para MySQL), o archivos `.sql` planos con un script propio.

## Decisión
Cada migración es un archivo `.sql` numerado (`NNNN_descripcion.sql`) en
`packages/db/migrations/`. Un script Node en JavaScript plano
(`migrate.mjs`, sin TypeScript) los aplica en orden, registrando cada
archivo ejecutado en una tabla `_migraciones` para no repetirlos.

Se evitó tanto un framework de migraciones (dependencia nueva sin
necesidad clara a este tamaño de proyecto) como escribir el runner en
TypeScript (hubiera requerido `ts-node`/`tsx` como dependencia adicional
solo para ejecutar un script de una vez).

## Consecuencias
- (+) Cero dependencias nuevas más allá de `mysql2`.
- (+) El `.sql` es exactamente lo que se ejecuta contra la base — no hay
  capa de traducción que depurar.
- (−) Sin rollback automático por migración (no hay `down.sql`) — a este
  tamaño de proyecto, revertir un cambio de esquema se hace con una
  migración nueva que deshace el anterior, no con un mecanismo genérico.
- (−) El runner exige `DB_NAME` explícito sin fallback, precisamente para
  que nunca corra "a ciegas" contra la base equivocada.
