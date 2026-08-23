# ADR 0001 — Sin ORM: patrón Repository sobre `mysql2` crudo

## Estado
Superada parcialmente por [ADR 0005](0005-migracion-laravel-nextjs-react-docker.md) (2026-07-30) — sigue siendo válida como explicación de la decisión tomada en su momento; el backend real del proyecto ya no usa `packages/db`.

Aceptado — Iteración 1 (2026-07-29)

## Contexto
El backoffice necesita persistencia real en MySQL para 26 tablas (documento
de diseño funcional del CMS, ya aprobado). Next.js con App Router puede
consumir cualquier driver de base de datos desde sus route handlers.

Las opciones evaluadas fueron: Prisma (u otro ORM), un query builder
(Kysely/Knex), o el driver `mysql2` con un patrón Repository escrito a mano.

## Decisión
Usar `mysql2/promise` directamente, con una clase genérica `BaseRepository<T>`
que resuelve el mapeo `camelCase` (TypeScript) ↔ `snake_case` (MySQL) y el
CRUD común, más subclases o instancias para cada entidad.

Se descarta Prisma explícitamente por instrucción directa del proyecto:
el modelo de datos ya está cerrado (documento del CMS aprobado) y el
equipo es una persona — un ORM aporta más valor cuando el esquema cambia
con frecuencia o el equipo es grande, ninguno de los dos es el caso aquí.

## Consecuencias
- (+) Cero dependencia de un motor de generación de código o cliente
  binario adicional; el esquema vive únicamente en los archivos `.sql`.
- (+) Control total sobre el SQL generado — relevante para índices y
  `CHECK` constraints ya definidos en las migraciones.
- (−) Cada entidad nueva requiere mapear sus columnas a mano en el
  repositorio correspondiente (mitigado por `BaseRepository`, que reduce
  esto a una lista de `{ts, db}` para los módulos sin lógica propia).
- (−) Sin migración de esquema automática a partir de cambios en tipos
  TypeScript — los tipos de `packages/types` y las migraciones de
  `packages/db/migrations` deben mantenerse sincronizados manualmente.
