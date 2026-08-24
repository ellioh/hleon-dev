# ADR 0007 — Experiencia: sin página propia, Organización generalizada, y el bug real de Select controlado/no-controlado

## Estado
Aceptado — Vertical Slice #2 completo (2026-08-24)

## Contexto
Segundo módulo construido siguiendo la arquitectura de referencia de Proyecto ([ADR 0006](0006-proyecto-arquitectura-referencia.md)). A diferencia de Proyecto, Experiencia no fue diseñada para tener una página pública por entrada — el propio código de la Iteración 1 (`ExperienciaRepository.ts`, nunca eliminado) ya lo documentaba: *"línea de tiempo laboral - insumo de /trayectoria y /hire-me"*. La migración original tampoco tenía `slug`, confirmando que nunca se planeó una URL individual.

## Decisión

### 1. Sin página de detalle, sin SEO polimórfico, sin galería de Media
`Experiencia` no tiene `slug`, no tiene relación `seo()`, no tiene `galeria()`/`videos()`. La API pública expone un único endpoint (`GET /api/experiencias`, lista completa) en vez del par lista+detalle de Proyecto. `app/trayectoria` consume esa lista y renderiza todo en una sola página tipo timeline. `/hire-me` (la página CV en inglés planeada en la estrategia de contenido) queda deliberadamente fuera de este slice: depende de Educación/Certificaciones/Habilidades, módulos que todavía no existen — construirla a medias sería fabricar estructura sin contenido real.

### 2. `experiencias.empresa` (string) → `organizacion_id` (FK a `organizaciones`)
La tabla `organizaciones` ya anticipaba este uso desde que se generalizó en la Fase 1 de Proyecto (comentario original: *"empleador, futuro uso en Experiencia vía `tipo`"*). Se editó la migración original de `experiencias` (tabla vacía, nunca usada) en vez de crear una nueva — mismo criterio que el rediseño de Proyecto antes de la Fase 1.

### 3. Sin paginación en el listado
`ExperienciaRepository::listar()` devuelve una `Collection` completa, no un `LengthAwarePaginator`. El volumen real de una línea de tiempo laboral (decenas de entradas en el escenario más grande) no justifica paginar — tanto el endpoint público como el admin listan todo. Si esto deja de ser cierto, se agrega paginación con el mismo patrón que Proyecto.

### 4. `experiencia_proyecto`: cruce con el portafolio
Pivot ya existente en el esquema desde la Fase 1, ahora implementado: una Experiencia puede vincularse a Proyectos reales del portafolio ("este proyecto lo hice en este trabajo"). `ExperienciaResource` reutiliza `ProyectoSummaryResource` para ese campo — cero código nuevo del lado de Proyecto.

### 5. `OrganizacionSelector`: componente nuevo, con un bug real encontrado y corregido
Al construir el selector de Organización (usado por Experiencia como empleador y retroactivamente por Proyecto como cliente, que nunca había tenido esta UI — ver más abajo) apareció un bug real y no obvio en el patrón de `<Select>` controlado de Radix UI:

**Síntoma**: al crear una organización nueva desde el diálogo inline y seleccionarla automáticamente (`onChange(nueva.id)`), el `<Select>` mostraba el placeholder en vez del nombre recién creado, y el valor del formulario volvía a `0` silenciosamente.

**Causa raíz** (confirmada con logging del lado del cliente, no adivinada): `<Select value={value ? String(value) : undefined}>` alterna entre no-controlado (`undefined`) y controlado (`"13"`, por ejemplo) según haya o no un valor. Cuando ese cambio ocurre en el mismo ciclo de render en que también cambia la lista de `<SelectItem>` (porque la organización nueva recién se agregó a la caché de React Query), el `<select>` nativo oculto que Radix usa internamente para compatibilidad de formularios reemite un evento `change` con valor vacío. Nuestro `onValueChange={(v) => onChange(Number(v))}` convierte eso en `Number("") = 0`, pisando la selección real. Confirmado que un `<Select>` que ya arranca controlado (como en la interacción normal del dropdown) no dispara esto — es específico de fijar el valor programáticamente a la vez que cambia la lista de opciones.

**Corrección** (dos partes, ambas necesarias):
1. `<Select value={value ? String(value) : ""}>` — nunca `undefined`, siempre controlado desde el primer render.
2. La selección del id recién creado se difiere un tick (`setTimeout(() => onChange(nueva.id), 0)`) para que el DOM monte el `<SelectItem>` nuevo antes de que el valor apunte a él.

Además, por separado: `SelectValue` de Radix solo resuelve el texto a mostrar a partir de un `<SelectItem>` ya montado - un valor fijado sin que el usuario haya abierto el desplegable (como al cargar un formulario de edición vía `form.reset()`) puede no mostrar la etiqueta aunque el valor sea correcto. Se corrigió pasando el texto ya resuelto como `children` explícito de `SelectValue` en vez de depender de la resolución automática.

**Este mismo patrón (`value ? String(value) : undefined`, sin children explícito) existía también en `CategorySelector`**, usado por Proyecto desde el inicio. Se corrigió ahí también con el mismo fix, de forma preventiva: el caso de "valor fijado por `form.reset()` al editar" ya ocurre hoy en el formulario de Proyecto (el `useEffect` que llama `form.reset(proyectoToFormValues(proyecto))`), y nunca había sido verificado específicamente si la Categoría se mostraba correcta al editar - es plausible que fuera el mismo bug, silencioso, desde la Iteración de Proyecto.

## Deuda técnica reconocida
- **`ProyectoResultado` sigue sin UI de escritura**: se confirmó durante este slice que el backend de Proyecto (`resultados`) se lee en todos lados pero nunca se pudo crear/editar desde ningún formulario — ni Store/UpdateProyectoRequest, ni el frontend. No se corrigió aquí (fuera del alcance de Experiencia), queda documentado para cuando se retome Proyecto.
- **`LogrosEditor` es local a `features/experiencia/`**, no un componente compartido. Si un módulo futuro necesita el mismo patrón de "lista de texto libre ordenable" (candidato natural: agregarle UI de escritura a `ProyectoResultado`), promoverlo a `components/shared/` en ese momento.
- **`ProyectoSelector` (multi-select de proyectos relacionados) es local a `features/experiencia/`** por la misma razón — sin otro consumidor todavía.

## Consecuencias
- El siguiente módulo puede reutilizar: `Organizacion` (ya con selector real, sin el bug de Select), el patrón "lista sin paginar" cuando el volumen de datos no lo justifique, y debe **evitar el patrón `value ? String(value) : undefined`** en cualquier `<Select>` nuevo — usar `value ?? ""` siempre.
- `/hire-me` queda pendiente hasta que existan Educación, Certificaciones y Habilidades (o una decisión explícita de construirla antes, con secciones vacías marcadas como pendientes en vez de omitidas).
