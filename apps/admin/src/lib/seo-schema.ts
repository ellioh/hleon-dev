import { z } from "zod";

/**
 * Espejo de ValidatesSeo (Laravel) - compartido por cualquier módulo con
 * SEO polimórfico (Proyecto, Post; Servicios/Certificaciones cuando
 * exista). Antes vivía duplicado dentro de proyecto-schema.ts; se extrajo
 * al agregarlo por segunda vez en Post (ver ADR de Blog).
 */
export const seoSchema = z.object({
  metaTitulo: z.string().max(160).nullable(),
  metaDescripcion: z.string().max(160).nullable(),
  canonicalUrl: z.union([z.literal(""), z.string().url()]).nullable(),
  robotsIndex: z.boolean(),
  robotsFollow: z.boolean(),
  ogTitulo: z.string().max(160).nullable(),
  ogDescripcion: z.string().max(200).nullable(),
  ogTipo: z.string(),
  twitterCard: z.enum(["summary", "summary_large_image"]),
  twitterTitulo: z.string().max(160).nullable(),
  twitterDescripcion: z.string().max(200).nullable(),
});

export type SeoFormValues = z.infer<typeof seoSchema>;

export const seoValoresVacios: SeoFormValues = {
  metaTitulo: null,
  metaDescripcion: null,
  canonicalUrl: null,
  robotsIndex: true,
  robotsFollow: true,
  ogTitulo: null,
  ogDescripcion: null,
  ogTipo: "website",
  twitterCard: "summary_large_image",
  twitterTitulo: null,
  twitterDescripcion: null,
};
