#!/usr/bin/env node
// Seeder de taxonomia base. SOLO contiene categorias y tecnologias que ya
// existen publicadas hoy en data/posts.json, data/proyectos.json y el
// arreglo `techs` de app/page.tsx del sitio actual - nada fue inventado.
// No se siembra Perfil, Experiencia, Testimonios ni ningun otro contenido
// biografico: eso requiere la informacion real de Heli, que se cargara
// cuando la confirme (ver aviso pendiente en el documento del CMS sobre
// "Heli Leon Atiquipa" vs "Hector Leon").
//
// Idempotente: usa ON DUPLICATE KEY UPDATE, correr dos veces no duplica filas.
//
// Uso: DB_NAME=hleon_dev node packages/db/seeders/0001_taxonomia_base.mjs

import mysql from "mysql2/promise";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}.`);
  return value;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Fuente: CATEGORIAS en app/admin/dashboard/blog/nuevo/page.tsx +
// categorias usadas en data/proyectos.json (todas ya publicadas hoy).
// tipo="ambos" porque el sistema anterior las usaba indistintamente para
// blog y proyectos con variaciones de nombre ("APIs" vs "API") - aqui
// quedan unificadas en una sola fila por categoria.
const CATEGORIAS = [
  "ERP",
  "CRM",
  "APIs",
  "E-commerce",
  "Consultoría",
  "Automatización",
  "Desarrollo Web",
  "General",
];

// Fuente: tecnologias de data/proyectos.json + techs[] de app/page.tsx.
const TECNOLOGIAS = [
  { nombre: "Laravel", categoria: "backend" },
  { nombre: "MySQL", categoria: "basededatos" },
  { nombre: "PostgreSQL", categoria: "basededatos" },
  { nombre: "Vue.js", categoria: "frontend" },
  { nombre: "Next.js", categoria: "frontend" },
  { nombre: "Bootstrap", categoria: "frontend" },
  { nombre: "Redis", categoria: "infraestructura" },
  { nombre: "Docker", categoria: "infraestructura" },
  { nombre: "Linux/VPS", categoria: "infraestructura" },
  { nombre: "PHP", categoria: "lenguaje" },
  { nombre: "Python", categoria: "lenguaje" },
  { nombre: "JavaScript", categoria: "lenguaje" },
  { nombre: "TypeScript", categoria: "lenguaje" },
  { nombre: "REST APIs", categoria: "herramienta" },
  { nombre: "AI", categoria: "otro" },
];

async function main() {
  const connection = await mysql.createConnection({
    host: requireEnv("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 3306),
    user: requireEnv("DB_USER"),
    password: requireEnv("DB_PASSWORD"),
    database: requireEnv("DB_NAME"),
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  });

  try {
    for (const [i, nombre] of CATEGORIAS.entries()) {
      await connection.execute(
        `INSERT INTO categorias (nombre, slug, tipo, orden)
         VALUES (?, ?, 'ambos', ?)
         ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)`,
        [nombre, slugify(nombre), i]
      );
    }
    console.log(`✓ ${CATEGORIAS.length} categorías sembradas/actualizadas.`);

    for (const [i, tec] of TECNOLOGIAS.entries()) {
      await connection.execute(
        `INSERT INTO tecnologias (nombre, categoria, orden)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE categoria = VALUES(categoria)`,
        [tec.nombre, tec.categoria, i]
      );
    }
    console.log(`✓ ${TECNOLOGIAS.length} tecnologías sembradas/actualizadas.`);
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error("Error al sembrar la taxonomía base:", err.message);
  process.exit(1);
});
