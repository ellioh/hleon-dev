import type { ProyectoFormValues } from "@/features/proyectos/proyecto-schema";

/**
 * El resto de la API responde en camelCase (ver ProyectoResource /
 * SeoResource), pero los Form Requests de Laravel validan `seo.*` en
 * snake_case (convención estándar de Laravel). Este es el único punto de
 * conversión - se usa al enviar, nunca al leer.
 */
export function seoFormToPayload(seo: ProyectoFormValues["seo"]) {
  return {
    meta_titulo: seo.metaTitulo,
    meta_descripcion: seo.metaDescripcion,
    canonical_url: seo.canonicalUrl || null,
    robots_index: seo.robotsIndex,
    robots_follow: seo.robotsFollow,
    og_titulo: seo.ogTitulo,
    og_descripcion: seo.ogDescripcion,
    og_tipo: seo.ogTipo,
    twitter_card: seo.twitterCard,
    twitter_titulo: seo.twitterTitulo,
    twitter_descripcion: seo.twitterDescripcion,
  };
}
