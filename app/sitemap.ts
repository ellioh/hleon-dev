import type { MetadataRoute } from "next";
import { getPostsPublicados } from "@/lib/posts-api";
import { getProyectosPublicados } from "@/lib/proyectos-api";
import { getServiciosVisibles } from "@/lib/servicios-api";

const BASE_URL = "https://hleon.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostsPublicados();
  const proyectos = await getProyectosPublicados();
  const servicios = await getServiciosVisibles();

  const categorias = Array.from(
    new Map(
      posts
        .map((p) => p.categoria)
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .map((c) => [c.id, c] as const)
    ).values()
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/servicios`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/portafolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/trayectoria`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/hire-me`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoriaPages: MetadataRoute.Sitemap = categorias.map((cat) => ({
    url: `${BASE_URL}/blog/categoria/${cat.slug}`,
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

  const servicioPages: MetadataRoute.Sitemap = servicios.map((s) => ({
    url: `${BASE_URL}/servicios/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...postPages, ...categoriaPages, ...proyectoPages, ...servicioPages];
}
