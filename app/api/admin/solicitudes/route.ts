import { NextRequest, NextResponse } from "next/server";
import { getSolicitudes, marcarLeido } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";

async function checkAuth() {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ ok: false, msg: "No autorizado" }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await checkAuth();
  if (denied) return denied;
  return NextResponse.json(getSolicitudes());
}

export async function PATCH(request: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  const body = await request.json();
  if (!body.id) return NextResponse.json({ ok: false, msg: "ID requerido" }, { status: 400 });
  marcarLeido(body.id);
  return NextResponse.json({ ok: true });
}
