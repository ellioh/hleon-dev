# ADR 0009 — Servicios: sin flujo de publicación, selector de un solo proyecto, y el TextListEditor generalizado

## Estado
Aceptado — Vertical Slice #4 completo (2026-08-25)

## Contexto
Cuarto módulo construido sobre la arquitectura de referencia de Proyecto ([ADR 0006](0006-proyecto-arquitectura-referencia.md)). El esquema de `servicios` (Fase 1) ya definía las diferencias reales con los módulos anteriores antes de escribir código: sin `estado_publicacion`, con `proyecto_ejemplo_id` como FK simple (no un pivot many-to-many), y con `servicio_entregables` repitiendo el patrón de lista de texto libre visto antes en `experiencia_logros`.

## Decisiones

### 1. Sin flujo de publicación - solo `visible`
Servicio no tiene `estado_publicacion`/`publicado` en el esquema aprobado. A diferencia de Proyecto/Experiencia/Post, el admin no tiene botones "Publicar"/"Despublicar": `visible` se cambia con un `PUT` normal, igual que cualquier otro campo del formulario, o desde una acción directa "Mostrar"/"Ocultar" en el listado (`useCambiarVisibilidadServicio`, un `PUT` parcial, sin endpoint dedicado). Confirmado con Playwright que el menú de acciones del listado genuinamente no ofrece "Publicar" - es una diferencia de esquema, no una omisión.

### 2. `proyecto_ejemplo_id`: selector de un solo proyecto, con enmascarado real
A diferencia de `proyecto_ids` (multi-select) en Experiencia, aquí es una FK simple. Se construyó `ProyectoEjemploSelector` (`features/servicios/`, un `<Select>` de una sola opción con "Sin proyecto de ejemplo" como valor de limpieza) aplicando desde el inicio la lección de [ADR 0007](0007-experiencia-sin-pagina-propia.md): siempre controlado (`value ?? "ninguno"`, nunca `undefined`) y con la etiqueta resuelta a mano como `children` de `SelectValue` - el bug de Radix documentado ahí no volvió a aparecer.

Se encontró y corrigió un **riesgo real de fuga de datos, no solo un caso hipotético**: `ServicioResource` embebe `proyectoEjemplo` con `ProyectoSummaryResource`, que no aplica ningún enmascarado por sí solo. Sin una capa adicional, un servicio público podría exponer el nombre, resumen y categoría de un proyecto todavía en borrador (o confidencial) solo por estar enlazado como "ejemplo". Se corrigió con `ServicioService::enmascarar()` (mismo patrón que `ProyectoService::enmascarar` para la confidencialidad), aplicado solo en `buscarPorSlugPublico()` - el admin siempre ve el dato completo. Verificado con un caso real: se enlazó un servicio a uno de los 4 proyectos reales (todos en borrador) y se confirmó que la respuesta pública y la página renderizada de Next.js correctamente omiten `proyectoEjemplo`.

### 3. `TextListEditor`: `LogrosEditor` generalizado
`servicio_entregables` es el tercer caso real del patrón "lista de texto libre ordenable con botones de mover" (el primero fue `experiencia_logros`; `proyecto_resultados` sigue sin UI de escritura, ver ADR 0006). En vez de copiar `LogrosEditor` una segunda vez, se promovió a `components/shared/text-list-editor.tsx` con `itemLabel`/`placeholder` configurables, y se actualizó `experiencia-form-page.tsx` para consumir la versión compartida. Sin cambios de comportamiento para Experiencia - mismos aria-labels, mismo reordenamiento.

### 4. Reutilización directa: Categoria, SEO polimórfico, patrón Repository/Service/Resource con split lista/detalle
Igual que Proyecto y Post (a diferencia de Experiencia): `ServicioSummaryResource`/`ServicioResource`, `ValidatesSeo`, slug único, soft delete. `descripcion_completa` se trata como texto plano (no markdown) en el sitio público, igual que las secciones narrativas de Proyecto - Servicio no tiene un campo equivalente a `contenido` de Post que ya fuera markdown desde antes.

### 5. Migración de contenido real: los 6 servicios del home
La sección `#servicios` de `app/page.tsx` tenía 6 servicios reales y completos hardcodeados (nombre, ícono, resumen). Se migraron con `visible = true` (ya estaban en producción) mapeando cada uno a una categoría ya existente. `descripcion_completa`, campo nuevo sin equivalente en el array anterior, se dejó igual al resumen breve en vez de inventar una versión expandida. La propia sección del home se migró de leer el array hardcodeado a consumir `getServiciosVisibles()`.

## Consecuencias
- El siguiente módulo (Certificaciones, o retomar Testimonios/Habilidades) puede reutilizar `TextListEditor` directamente si tiene el mismo patrón, y debe revisar temprano si algún campo de relación embebida necesita enmascarado antes de exponerse públicamente - no asumir que el Resource reutilizado (`ProyectoSummaryResource`, etc.) ya lo aplica por sí solo.
- Deuda no corregida en este slice: la portada (`app/page.tsx`) sigue usando `data/proyectos.json` vía `lib/data.ts` para "Proyectos destacados" (gap ya anotado en el ADR de Blog); `ProyectoResultado` sigue sin UI de escritura.
