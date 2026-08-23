import mysql from "mysql2/promise";

/**
 * Pool compartido para toda la app. `multipleStatements` queda deshabilitado
 * a propósito (default de mysql2): todo query de la aplicación va parametrizado,
 * y permitir múltiples sentencias por request ampliaría el radio de una
 * eventual inyección SQL. El runner de migraciones usa su propia conexión
 * (ver migrate.mjs) precisamente para no tener que relajar esta regla aquí.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name} (conexión a MySQL)`);
  }
  return value;
}

let pool: mysql.Pool | undefined;

export function getPool(): mysql.Pool {
  if (pool) return pool;

  pool = mysql.createPool({
    host: requireEnv("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 3306),
    user: requireEnv("DB_USER"),
    password: requireEnv("DB_PASSWORD"),
    database: requireEnv("DB_NAME"),
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true,
  });

  return pool;
}

export type SqlParams = ReadonlyArray<string | number | boolean | null>;

export async function query<T>(sql: string, params: SqlParams = []): Promise<T[]> {
  const [rows] = await getPool().query(sql, [...params]);
  return rows as T[];
}

export async function execute(sql: string, params: SqlParams = []): Promise<mysql.ResultSetHeader> {
  const [result] = await getPool().execute(sql, [...params]);
  return result as mysql.ResultSetHeader;
}
