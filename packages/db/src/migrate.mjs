#!/usr/bin/env node
// Runner de migraciones en JS plano (sin TypeScript) para no depender de
// ts-node/tsx solo para correr scripts de una vez - ver Iteracion 1,
// seccion "por que esta forma y no otra" del plan aprobado.
//
// Uso: DB_NAME=hleon_dev node packages/db/src/migrate.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(CURRENT_DIR, "..", "migrations");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. El runner de migraciones no corre sin un DB_NAME explicito.`);
  }
  return value;
}

async function main() {
  const connection = await mysql.createConnection({
    host: requireEnv("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 3306),
    user: requireEnv("DB_USER"),
    password: requireEnv("DB_PASSWORD"),
    database: requireEnv("DB_NAME"),
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
    multipleStatements: true, // solo esta conexion de migracion, no el pool de la app
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS _migraciones (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(160) NOT NULL,
        ejecutado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_migraciones_nombre (nombre)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [ejecutadas] = await connection.query("SELECT nombre FROM _migraciones");
    const yaEjecutadas = new Set(ejecutadas.map((r) => r.nombre));

    const archivos = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    let aplicadas = 0;
    for (const archivo of archivos) {
      if (yaEjecutadas.has(archivo)) continue;

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, archivo), "utf-8");
      console.log(`→ Aplicando ${archivo}`);

      await connection.query(sql);
      await connection.query("INSERT INTO _migraciones (nombre) VALUES (?)", [archivo]);
      aplicadas++;
    }

    if (aplicadas === 0) {
      console.log("Sin migraciones nuevas. La base ya está al día.");
    } else {
      console.log(`${aplicadas} migración(es) aplicada(s) correctamente.`);
    }
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error("Error al correr las migraciones:", err.message);
  process.exit(1);
});
