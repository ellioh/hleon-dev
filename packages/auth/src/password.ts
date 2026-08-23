import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

/**
 * Hash de contraseña con `crypto.scrypt` nativo de Node - sin `bcrypt` ni
 * ninguna dependencia nueva (checklist anti-sobreingeniería de la
 * Iteración 1: Node ya trae una función de derivación de clave adecuada
 * para contraseñas, no hace falta una librería externa).
 *
 * Formato almacenado: "<salt-hex>:<hash-hex>".
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  const hashBuffer = Buffer.from(hashHex, "hex");
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  if (derived.length !== hashBuffer.length) return false;
  // timingSafeEqual evita filtrar por temporización cuánto del hash coincide.
  return timingSafeEqual(derived, hashBuffer);
}
