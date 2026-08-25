# ADR 0010 — Certificaciones: el módulo más simple, y un bug de defaults reconfirmado

## Estado
Aceptado — Vertical Slice #5 completo (2026-08-25)

## Contexto
Quinto módulo sobre la arquitectura de referencia de Proyecto ([ADR 0006](0006-proyecto-arquitectura-referencia.md)). El esquema de `certificaciones` (Fase 1) es, con diferencia, el más simple de los cinco: sin categoría, sin descripción larga, sin SEO, sin slug, sin flujo de publicación. Estructuralmente es el más parecido a Experiencia (insumo de `/trayectoria`, sin página propia - ver [ADR 0007](0007-experiencia-sin-pagina-propia.md)) combinado con la ausencia de flujo de publicación de Servicio (solo `visible` - ver [ADR 0009](0009-servicios-sin-flujo-de-publicacion.md)).

## Decisiones

### 1. Sin contenido inicial que migrar
A diferencia de Proyecto (4 proyectos reales), Blog (3 artículos reales) y Servicios (6 servicios reales), no existía ninguna certificación en el sitio anterior. No hay `CertificacionSeeder` - el módulo nace genuinamente vacío, y el usuario carga sus certificaciones reales (AWS, Azure, etc.) por primera vez desde el admin. Es el caso más simple de la política de no-fabricación: no hay nada que migrar ni que dejar en un estado intermedio.

### 2. Formulario sin pestañas
Con tan pocos campos (nombre, emisor, dos fechas, credencial, URL de verificación, insignia, visibilidad), envolver el formulario en `<Tabs>` habría sido complejidad sin beneficio - es el primer formulario del panel que es una sola sección continua. Confirma el principio ya aplicado implícitamente en Perfil (también sin pestañas, por ser un singleton): la estructura del formulario sigue la complejidad real del modelo, no una plantilla fija.

### 3. `fecha_expiracion` nullable, sin booleano auxiliar
A diferencia de `actual`/`fecha_fin` en Experiencia (que necesitan un booleano porque "actual" es un estado distinto de "no tengo la fecha"), aquí `fecha_expiracion = null` ya significa exactamente "no expira" sin ambigüedad. El formulario sí agrega un checkbox "No expira" en la UI (mejor UX que un campo de fecha vacío sin explicación), pero es solo una conveniencia de interfaz - el modelo de datos no lo necesita.

### 4. Bug de defaults nulos, reconfirmado y corregido preventivamente
Se reprodujo el mismo bug documentado en el [ADR de Blog](0008-blog-perfil-y-audiencia.md) (`publicado: null` tras crear) - aquí con `visible`/`destacado`/`orden` mostrando `null` en vez de sus valores por defecto reales (`true`/`false`/`0`) justo después de crear una certificación sin especificarlos. Mismo mecanismo: Eloquent no relee los defaults de columna en el objeto recién creado tras el `INSERT`. Corregido con el mismo patrón (`$datos['visible'] ??= true` etc. en `CertificacionService::crear()`).

No se hizo una auditoría retroactiva de Proyecto/Servicio para el mismo patrón: sus formularios de React siempre envían estos campos con valores reales (confirmado en sus esquemas Zod), así que el bug nunca es alcanzable a través del uso real del panel - solo se manifiesta al probar la API directamente sin pasar por el formulario, como ocurrió aquí y en Post. Queda como algo a verificar activamente (probar creación vía curl sin campos opcionales) en cualquier módulo futuro antes de darlo por completo.

## Consecuencias
- Con los cinco módulos del CMS original completos (Proyectos, Experiencia, Blog, Servicios, Certificaciones), el patrón de arquitectura de referencia queda validado en sus tres variantes: con página propia + publicación (Proyecto, Post), sin página propia (Experiencia, Certificaciones), y sin publicación (Servicio, Certificaciones).
- Deuda no corregida, ya anotada en ADRs anteriores: "Proyectos destacados" en el home sigue leyendo `data/proyectos.json`; `ProyectoResultado` sigue sin UI de escritura; `tipo_audiencia` de Post no ramifica el CTA público todavía.
