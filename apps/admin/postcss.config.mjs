// Sombrea el postcss.config.mjs de la raíz (para el Next.js/Tailwind v3
// del sitio público) - PostCSS busca configs hacia arriba en el árbol de
// carpetas, y sin este archivo aquí, apps/admin heredaría por error el
// plugin de Tailwind v3, incompatible con las directivas v4 de este
// paquete. @tailwindcss/vite ya procesa Tailwind directamente, así que
// este archivo se queda vacío a propósito.
const config = { plugins: {} };
export default config;
