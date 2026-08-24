import { getPostsPublicados } from "@/lib/posts-api";

const BASE_URL = "https://hleon.dev";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPostsPublicados();
  const nombreAutor = posts[0]?.autor?.nombre ?? "Héctor León";

  const items = posts
    .slice(0, 20)
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.titulo)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.resumen)}</description>
      ${post.fechaPublicacion ? `<pubDate>${new Date(post.fechaPublicacion).toUTCString()}</pubDate>` : ""}
      ${post.categoria ? `<category>${escapeXml(post.categoria.nombre)}</category>` : ""}
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
      <author>hector@hleon.dev (${escapeXml(post.autor?.nombre ?? nombreAutor)})</author>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog de ${escapeXml(nombreAutor)} — Sistemas Empresariales</title>
    <link>${BASE_URL}</link>
    <description>Artículos sobre desarrollo de software empresarial, ERP, APIs y transformación digital para empresas en Perú y Latinoamérica.</description>
    <language>es-PE</language>
    <managingEditor>hector@hleon.dev (${escapeXml(nombreAutor)})</managingEditor>
    <webMaster>hector@hleon.dev (${escapeXml(nombreAutor)})</webMaster>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
