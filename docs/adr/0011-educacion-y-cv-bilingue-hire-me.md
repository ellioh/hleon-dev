# ADR 0011 — Educación, y el sitio como CV bilingüe (`/hire-me`)

## Estado
Aceptado (2026-08-25)

## Contexto
El usuario pidió que el sitio funcione también como CV, en español e inglés. Antes de implementar se resolvieron tres preguntas abiertas de arquitectura con el usuario:

1. **Alcance del inglés**: traducción completa de cada campo, o una versión "más liviana" pensada solo para lo que un CV en inglés necesita. Se eligió la opción liviana.
2. **Si construir Educación ahora**: el esquema de `educaciones` existía desde la Fase 1 pero nunca se había implementado (sin modelo, sin controller, sin UI). Se eligió construirlo ahora, como sexto módulo vertical, porque un CV sin educación está incompleto.
3. **Si generar PDF descargable**: se eligió solo la página web por ahora - un PDF necesitaría una dependencia nueva y el módulo de Descargas, que no existe todavía.

## Decisiones

### 1. Educación sigue el patrón "módulo simple" de Certificacion
Mismo criterio que [ADR 0010](0010-certificaciones-el-modulo-mas-simple.md): sin categoría, sin SEO polimórfico, sin slug, sin flujo de publicación - solo `visible`. Único campo con lógica de negocio real: `en_curso` y `fecha_fin` son mutuamente excluyentes (`CHECK` en la migración + validación en `EducacionService`, mismo patrón que `actual`/`fecha_fin` en Experiencia). A diferencia de Experiencia, no hay booleano `destacado` ni relaciones (tecnologías, proyectos, logros) - una institución y un título son suficientes.

### 2. Traducción "liviana": solo los campos que un CV realmente necesita
Se agregaron columnas `*_en` nullable a las tablas ya existentes, en vez de una tabla de traducciones o un sistema i18n genérico:

| Tabla | Campo ES | Campo EN agregado |
|---|---|---|
| `experiencias` | `rol`, `resumen` | `rol_en`, `resumen_en` |
| `perfil` | `titulo_profesional`, `bio_larga` | `titulo_profesional_en`, `bio_larga_en` |
| `educaciones` | `titulo` | `titulo_en` (nombres de institución son nombres propios, no se traducen) |

Deliberadamente **no** se tradujeron `descripcion`/`logros` de Experiencia: son contenido narrativo largo, y el objetivo de `/hire-me` es un resumen compacto tipo CV, no una traducción 1:1 de `/trayectoria`. Si en el futuro se necesita una versión en inglés más completa, esta decisión se revisa entonces - no se diseñó de más para un caso hipotético.

### 3. Regla de no-mezcla de idiomas: sin fallback a español en `/hire-me`
Una Experiencia o Educación **solo aparece en `/hire-me` si sus campos en inglés están realmente completos** (`rol_en` Y `resumen_en` para Experiencia; `titulo_en` para Educación). Nunca se muestra el texto en español como respaldo en una página etiquetada en inglés - eso produciría un CV con idiomas mezclados y de aspecto roto. Es la misma política de no-fabricación aplicada en todo el proyecto (nunca inventar ni improvisar contenido), llevada a su forma bilingüe: contenido vacío se omite, nunca se sustituye por el idioma equivocado.

Si absolutamente nada tiene contenido en inglés todavía (perfil sin bio EN, cero experiencias/educaciones con campos EN), `/hire-me` muestra un estado vacío explícito con enlace a la versión en español, en vez de una página en blanco.

### 4. `/trayectoria` es el CV en español; no se creó una ruta `/cv` nueva
Con Educación agregada a `/trayectoria` (entre la línea de tiempo de Experiencia y Certificaciones), esa página ya cumple el rol de CV en español. Crear una ruta `/cv` separada habría duplicado contenido sin necesidad.

### 5. Nuevo endpoint público `GET /api/perfil`
Hasta ahora Perfil solo se leía desde el admin (`GET /api/admin/perfil`) - nada en el sitio público lo consumía todavía (`Post.autor_id` se resuelve del lado del servidor, sin pasar por una página "Acerca de"). `/hire-me` es el primer consumidor público real, así que se agregó `Api\PerfilController` (público, sin auth) devolviendo el mismo `PerfilResource`. El controller de admin queda como CRUD; el público es de solo lectura.

### 6. Nota de depuración: el Data Cache de Next.js sobrevive a reiniciar `next dev`
Durante la verificación final, se sembraron datos de prueba con campos EN *después* de haber visitado `/hire-me` una vez en vacío. Las visitas posteriores seguían mostrando el estado vacío incluso reiniciando el servidor de desarrollo - el fetch cache (`.next/cache`) persiste en disco entre reinicios de `next dev`, no solo en memoria del proceso. Solo se resolvió al borrar `.next/cache` explícitamente. Vale la pena recordarlo para cualquier verificación futura que siembre datos después de una visita inicial en vacío: reiniciar el servidor no alcanza, hay que limpiar el caché en disco (o esperar la ventana de `revalidate`).

## Consecuencias
- Sexto módulo vertical completo (Proyectos, Experiencia, Blog, Servicios, Certificaciones, Educación), y primera funcionalidad que cruza los tres módulos existentes (Perfil, Experiencia, Educación) para componer una página nueva.
- Deuda deliberada, no un descuido: sin PDF descargable, sin traducción de `descripcion`/`logros`, sin traducción de Servicios/Blog (fuera del alcance de "CV bilingüe" acordado). Si se pide un PDF descargable más adelante, necesita el módulo de Descargas (no construido) más una librería de generación de PDF (nueva dependencia, a evaluar entonces).
