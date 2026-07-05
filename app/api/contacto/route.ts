import { NextRequest, NextResponse } from "next/server";
import { saveSolicitud } from "@/lib/data";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nombre, email, empresa, tipo, descripcion, presupuesto } = body;
  if (!nombre || !email || !tipo || !descripcion) {
    return NextResponse.json({ ok: false, msg: "Faltan campos requeridos" }, { status: 400 });
  }
  const s = saveSolicitud({
    nombre,
    email,
    empresa: empresa || "",
    tipo,
    descripcion,
    presupuesto: presupuesto || "",
  });
  return NextResponse.json({ ok: true, id: s.id });
}
