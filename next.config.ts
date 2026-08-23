import type { NextConfig } from "next";

// Host de medios de la API de Laravel (packages de imágenes de Proyecto/etc.)
// - se deriva de LARAVEL_API_URL en vez de hardcodearlo, así que apuntar la
// variable a la API real en producción (una vez desplegada) basta sin tocar
// este archivo.
const apiUrl = new URL(process.env.LARAVEL_API_URL ?? "http://localhost:8123");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
