import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;
  const correctPassword = process.env.ADMIN_PASSWORD ?? "changeme";

  if (password !== correctPassword) {
    return NextResponse.json({ ok: false, msg: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = generateToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set("hleon_admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return response;
}
