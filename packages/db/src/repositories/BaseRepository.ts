import { execute, query, type SqlParams } from "../client.js";

/**
 * Une un campo TypeScript (camelCase) con su columna MySQL (snake_case).
 * Los nombres de tabla/columna son constantes definidas por nosotros, nunca
 * datos de request - por eso es seguro interpolarlos en el SQL; solo los
 * VALORES viajan parametrizados.
 */
export interface ColumnDef {
  ts: string;
  db: string;
}

export interface FindAllOptions {
  where?: string;
  params?: SqlParams;
  orderBy?: string;
  limit?: number;
  offset?: number;
}

/**
 * CRUD genérico sobre una tabla, con mapeo camelCase (TypeScript) ↔
 * snake_case (MySQL) resuelto en un solo lugar. Los módulos "maestro"
 * simples (Categoria, Tecnologia, Cliente, Habilidad, Faq, Enlace,
 * Educacion, Certificacion) se exponen como instancias directas de esta
 * clase; los módulos con reglas propias (Proyecto, Post, Experiencia...)
 * extienden esta clase para agregar sus métodos específicos.
 */
export class BaseRepository<T extends { id: number }> {
  protected readonly table: string;
  protected readonly columns: ColumnDef[];
  protected readonly softDelete: boolean;

  constructor(table: string, columns: ColumnDef[], options: { softDelete?: boolean } = {}) {
    this.table = table;
    this.columns = columns;
    this.softDelete = options.softDelete ?? false;
  }

  protected selectClause(): string {
    return this.columns.map((c) => `${c.db} AS ${c.ts}`).join(", ");
  }

  protected activeClause(): string {
    return this.softDelete ? "eliminado_en IS NULL" : "1=1";
  }

  async findAll(opts: FindAllOptions = {}): Promise<T[]> {
    const conditions = [this.activeClause()];
    if (opts.where) conditions.push(opts.where);

    let sql = `SELECT ${this.selectClause()} FROM ${this.table} WHERE ${conditions.join(" AND ")}`;
    if (opts.orderBy) sql += ` ORDER BY ${opts.orderBy}`;
    if (opts.limit) sql += ` LIMIT ${Number(opts.limit)}`;
    if (opts.offset) sql += ` OFFSET ${Number(opts.offset)}`;

    return query<T>(sql, opts.params ?? []);
  }

  async findById(id: number): Promise<T | null> {
    const sql = `SELECT ${this.selectClause()} FROM ${this.table} WHERE id = ? AND ${this.activeClause()} LIMIT 1`;
    const rows = await query<T>(sql, [id]);
    return rows[0] ?? null;
  }

  /** Crea una fila a partir de los campos presentes en `data` (id se ignora si viene). */
  async create(data: Partial<T>): Promise<T> {
    const entries = this.columns.filter((c) => c.ts !== "id" && data[c.ts as keyof T] !== undefined);
    const dbCols = entries.map((c) => c.db);
    const placeholders = entries.map(() => "?").join(", ");
    const values = entries.map((c) => this.toSqlValue(data[c.ts as keyof T]));

    const sql = `INSERT INTO ${this.table} (${dbCols.join(", ")}) VALUES (${placeholders})`;
    const result = await execute(sql, values);

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error(`No se pudo leer de vuelta el registro recién creado en ${this.table}`);
    }
    return created;
  }

  /** Actualiza solo los campos presentes en `data`. */
  async update(id: number, data: Partial<T>): Promise<T | null> {
    const entries = this.columns.filter((c) => c.ts !== "id" && data[c.ts as keyof T] !== undefined);
    if (entries.length === 0) return this.findById(id);

    const setClause = entries.map((c) => `${c.db} = ?`).join(", ");
    const values = entries.map((c) => this.toSqlValue(data[c.ts as keyof T]));

    const sql = `UPDATE ${this.table} SET ${setClause} WHERE id = ?`;
    await execute(sql, [...values, id]);

    return this.findById(id);
  }

  /**
   * Comprueba unicidad de una columna (típicamente `slug`), excluyendo
   * opcionalmente un id - patrón compartido por Proyecto, Post y Servicio
   * para no repetir la misma consulta en cada repositorio.
   */
  async existsByColumn(dbColumn: string, value: string, excludeId?: number): Promise<boolean> {
    let sql = `SELECT id FROM ${this.table} WHERE ${dbColumn} = ?`;
    const params: (string | number)[] = [value];
    if (excludeId) {
      sql += " AND id != ?";
      params.push(excludeId);
    }
    const rows = await query<{ id: number }>(sql, params);
    return rows.length > 0;
  }

  /** Soft delete si la tabla lo soporta; de lo contrario, elimina en duro. */
  async delete(id: number): Promise<void> {
    if (this.softDelete) {
      await execute(`UPDATE ${this.table} SET eliminado_en = NOW() WHERE id = ?`, [id]);
    } else {
      await execute(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    }
  }

  private toSqlValue(value: unknown): string | number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "object") return JSON.stringify(value);
    return value as string | number;
  }
}
