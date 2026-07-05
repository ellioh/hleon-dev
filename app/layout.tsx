import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Héctor León — Desarrollo de Sistemas Empresariales",
  description:
    "Desarrollo sistemas empresariales a medida: ERP, CRM, plataformas web y APIs. Soluciones tecnológicas para hacer crecer tu negocio.",
  keywords: ["desarrollo de sistemas", "ERP", "CRM", "software empresarial", "Peru"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
