import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_TOKEN_SECRET ?? "default-secret-32-chars-min";

export function generateToken(): string {
  return Buffer.from(`${SECRET}:${Date.now()}`).toString("base64");
}

export function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(`${SECRET}:`);
  } catch {
    return false;
  }
}

export async function getAdminToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("hleon_admin_token")?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAdminToken();
  if (!token) return false;
  return verifyToken(token);
}
