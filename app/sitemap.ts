import type { MetadataRoute } from "next";
import { getPosts, getCategorias } from "@/lib/blog";
import { getProyectosPublicados } from "@/lib/proyectos-api";

const BASE_URL = "https://hleon.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getPosts();
  const categorias = getCategorias();
  const proyectos = await getProyectosPublicados();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/portafolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/trayectoria`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.fechaActualizacion),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoriaPages: MetadataRoute.Sitemap = categorias.map((cat) => ({
    url: `${BASE_URL}/blog/categoria/${encodeURIComponent(cat.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const proyectoPages: MetadataRoute.Sitemap = proyectos.map((p) => ({
    url: `${BASE_URL}/portafolio/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...postPages, ...categoriaPages, ...proyectoPages];
}
