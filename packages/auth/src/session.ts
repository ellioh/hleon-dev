import { createHmac, timingSafeEqual } from "node:crypto";

const SIETE_DIAS_EN_SEGUNDOS = 60 * 60 * 24 * 7;

/**
 * Token de sesión firmado con HMAC-SHA256 y expiración real - reemplaza
 * el esquema de la auditoría técnica (base64 de "secreto:timestamp" sin
 * firma, con un secreto por defecto público en el código). Sin
 * `jsonwebtoken` ni dependencias nuevas: HMAC ya vive en `node:crypto`.
 *
 * Formato del token: "<base64url(payload)>.<hmac-hex>"
 */

export interface SessionPayload {
  userId: number;
  exp: number; // epoch seconds
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET no está configurado o es demasiado corto (mínimo 32 caracteres). " +
        "A diferencia del esquema anterior, no existe un valor por defecto: sin este secreto, el login no puede emitir sesiones."
    );
  }
  return secret;
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("hex");
}

export function createSessionToken(userId: number, ttlSeconds: number = SIETE_DIAS_EN_SEGUNDOS): string {
  const payload: SessionPayload = { userId, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const firma = sign(encoded);
  return `${encoded}.${firma}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [encoded, firma] = token.split(".");
  if (!encoded || !firma) return null;

  const firmaEsperada = sign(encoded);
  const firmaBuffer = Buffer.from(firma, "hex");
  const esperadaBuffer = Buffer.from(firmaEsperada, "hex");
  if (firmaBuffer.length !== esperadaBuffer.length || !timingSafeEqual(firmaBuffer, esperadaBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null; // expirado
    return payload;
  } catch {
    return null;
  }
}
