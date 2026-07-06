# hleon.dev — Contexto para Claude Code

Sitio personal y portafolio de Hector Leon (consultor de sistemas, Peru).
Captacion de leads para servicios de consultoria (ERP, APIs, digitalizacion).

- URL produccion: https://hleon.dev
- Repo: https://github.com/ellioh/hleon-dev (rama `main`)
- Deploy: Vercel — cada push a main despliega automaticamente

---

## Instruccion permanente

**Despues de CADA tarea completada**: `git add`, `git commit`, `git push`.
Sin excepcion. No esperar a que el usuario lo pida.

---

## Stack

| Que          | Cual                                      |
|--------------|-------------------------------------------|
| Framework    | Next.js 16 (App Router), React 19         |
| Lenguaje     | TypeScript 5 strict                       |
| Estilos      | Tailwind CSS 3 — clases directas, sin CSS modules |
| Base de datos| Ninguna — JSON planos en `/data/`         |
| Auth         | Cookie httpOnly propia (sin NextAuth)     |
| Markdown     | Renderer propio en `lib/markdown.ts`      |
| Dependencias | Solo next + react + react-dom             |

Comandos:
```
npm run dev        # desarrollo
npm run build      # build + typecheck
npx tsc --noEmit   # solo typecheck
```

---

## Paleta de colores (NO mezclar con scraperfy)

| Rol          | Clase Tailwind                          |
|--------------|-----------------------------------------|
| Fondo        | `slate-950`                             |
| Acento       | `indigo-400` / `indigo-500`             |
| Texto        | `white` (h1), `slate-300/400` (cuerpo) |
| Bordes       | `slate-800`                             |
| Card hover   | `border-indigo-800/60`, `text-indigo-300` |
| Punto logo   | `bg-indigo-400 animate-pulse`           |
| Gradiente    | `from-indigo-400 to-cyan-400`           |

---

## Estructura de archivos

```
app/
  layout.tsx                  — metadata SEO global + JSON-LD Person + WebSite
  page.tsx                    — Homepage (server component)
  portafolio/page.tsx
  blog/
    page.tsx                  — Listado con filtro por categoria
    [slug]/page.tsx           — Post + JSON-LD BlogPosting
    categoria/[categoria]/page.tsx
  contacto/page.tsx
  sitemap.ts / robots.ts
  feed.xml/route.ts           — RSS 2.0
  admin/
    page.tsx                  — Login
    layout.tsx
    dashboard/
      layout.tsx              — Sidebar con links (hleon tiene sidebar compartido)
      page.tsx                — Stats: solicitudes + blog
      solicitudes/page.tsx
      proyectos/page.tsx      — CRUD proyectos del portafolio
      blog/
        page.tsx / nuevo/page.tsx / [id]/page.tsx
  api/
    contacto/route.ts
    admin/
      login/ logout/ solicitudes/ proyectos/ blog/ blog/[id]/

lib/
  auth.ts        — isAuthenticated(), cookie: "hleon_admin_token"
  blog.ts        — getPosts, getPost, getPostById, savePost, deletePost,
                   getCategorias, getPostsByCategoria, slugify
  data.ts        — getProyectos, saveProyectos, getSolicitudes, saveSolicitud, marcarLeido
  markdown.ts    — renderMarkdown(raw): string

data/
  posts.json / proyectos.json / solicitudes.json
```

---

## Modelos de datos

**Post** (`data/posts.json`):
```json
{
  "id": "post-001",
  "titulo": "...",
  "slug": "slug-kebab-case",
  "resumen": "...",
  "contenido": "## H2\n\nMarkdown...",
  "categoria": "ERP",
  "fechaPublicacion": "2025-01-15",
  "fechaActualizacion": "2025-01-15",
  "tags": ["erp", "pymes"],
  "metaDescripcion": "max 160 chars",
  "publicado": true
}
```

**Proyecto** (`data/proyectos.json`):
```json
{
  "id": "...",
  "titulo": "...",
  "descripcion": "...",
  "tecnologias": ["Laravel", "MySQL"],
  "categoria": "ERP",
  "imagen": null,
  "url": null,
  "destacado": true,
  "orden": 1
}
```

**Solicitud** (`data/solicitudes.json`):
```json
{
  "id": "1700000000000",
  "nombre": "...", "email": "...", "empresa": "...",
  "tipo": "ERP", "descripcion": "...", "presupuesto": "...",
  "fecha": "2025-01-15T10:00:00.000Z",
  "leido": false
}
```

---

## Autenticacion admin

- Cookie: `hleon_admin_token`
- Env vars necesarias: `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET`
- Flujo: login → POST `/api/admin/login` → cookie httpOnly → `isAuthenticated()` en cada ruta protegida
- Las API routes de blog verifican con `ADMIN_SECRET` env var directamente

---

## Convenciones clave

1. **Server components por defecto.** Usar `"use client"` solo si hay `useState`, `useEffect` o eventos.
2. **Nunca importar `lib/blog.ts`, `lib/data.ts` en un `"use client"`** — usan `fs` de Node.js.
3. Si un server component necesita datos + interactividad: extraer la parte interactiva a un componente `"use client"` separado.
4. Las API routes de `/api/admin/*` siempre verifican auth primero. Error estandar: `{ error: "No autorizado" }` status 401.
5. `generateStaticParams` en rutas dinamicas del blog. `generateMetadata` para SEO dinamico.
6. IDs: strings. Nuevos registros: `Date.now().toString()`.
7. Sin imagenes de posts. Sin librerias de UI externas. Sin `@apply` en CSS.

---

## Markdown renderer (lib/markdown.ts)

Renderer propio (sin remark/marked). Clases aplicadas:
- H2: `text-2xl font-bold text-white mt-8 mb-4`
- Codigo: `bg-slate-800 ... text-cyan-400`
- Parrafos: `text-slate-300 leading-relaxed mb-4`
- Bullets: `text-indigo-400`
- Links: `text-indigo-400 hover:text-indigo-300`

Uso: `<div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.contenido) }} />`

---

## Social profiles (homepage)

Definidos como constantes en `app/page.tsx`:
```ts
const SOCIAL = { upwork: "#", workana: "#", linkedin: "#", github: "https://github.com/ellioh" };
```
Links con `"#"` no se renderizan. Reemplazar con URL real para activarlos.

---

## Errores comunes

| Error | Causa | Solucion |
|-------|-------|----------|
| "only works in a Client Component" | Importar lib/*.ts en "use client" | Mover datos a server component padre |
| Tipo union no asignable a literal | `useState` infiere tipo demasiado estrecho | `useState<TipoUnion>({ ... })` |
| 401 en API de blog | `ADMIN_SECRET` no configurado | Agregar a .env.local |

---

## Referencia completa

Ver `leame-IA.txt` en la raiz del repo para documentacion extendida.
