import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://hleon.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Héctor León — Desarrollo de Sistemas Empresariales a Medida",
    template: "%s | hleon.dev",
  },
  description:
    "Ingeniero de software especializado en sistemas empresariales a medida: ERP, CRM, plataformas web y APIs REST. +5 años de experiencia. Perú y Latinoamérica.",
  keywords: [
    "desarrollo de sistemas",
    "software empresarial",
    "ERP a medida",
    "CRM personalizado",
    "APIs REST",
    "Laravel",
    "Next.js",
    "digitalización empresas",
    "Perú",
    "freelancer sistemas",
  ],
  authors: [{ name: "Héctor León", url: BASE_URL }],
  creator: "Héctor León",
  publisher: "Héctor León",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: BASE_URL,
    siteName: "hleon.dev",
    title: "Héctor León — Desarrollo de Sistemas Empresariales a Medida",
    description:
      "Ingeniero de software especializado en sistemas empresariales: ERP, CRM, APIs y plataformas web para empresas en Perú y Latinoamérica.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Héctor León — Sistemas Empresariales",
    description: "Desarrollo de software empresarial a medida: ERP, CRM, APIs y plataformas web.",
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": `${BASE_URL}/feed.xml`,
    },
  },
};

const jsonLdPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Héctor León",
  url: BASE_URL,
  jobTitle: "Ingeniero de Software / Desarrollador de Sistemas Empresariales",
  description:
    "Especialista en desarrollo de software empresarial a medida: ERP, CRM, APIs REST y plataformas web para empresas en Perú y Latinoamérica.",
  knowsAbout: [
    "ERP",
    "CRM",
    "Software Empresarial",
    "APIs REST",
    "Laravel",
    "Next.js",
    "PHP",
    "MySQL",
    "Digitalización Empresarial",
  ],
  sameAs: ["https://github.com/ellioh"],
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "hleon.dev",
  url: BASE_URL,
  description: "Desarrollo de sistemas empresariales a medida en Perú",
  author: { "@type": "Person", name: "Héctor León" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
