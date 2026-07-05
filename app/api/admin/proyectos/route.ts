import { NextRequest, NextResponse } from "next/server";
import { getProyectos, saveProyectos } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import type { Proyecto } from "@/lib/data";

async function checkAuth() {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ ok: false, msg: "No autorizado" }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await checkAuth();
  if (denied) return denied;
  return NextResponse.json(getProyectos());
}

export async function POST(request: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  const body = await request.json();
  const proyectos = getProyectos();
  const nuevo: Proyecto = {
    id: Date.now().toString(),
    titulo: body.titulo,
    descripcion: body.descripcion,
    tecnologias: body.tecnologias ?? [],
    categoria: body.categoria,
    imagen: body.imagen ?? null,
    url: body.url ?? null,
    destacado: body.destacado ?? false,
    orden: body.orden ?? 99,
  };
  proyectos.push(nuevo);
  saveProyectos(proyectos);
  return NextResponse.json({ ok: true, proyecto: nuevo });
}

export async function PUT(request: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  const body = await request.json();
  const proyectos = getProyectos();
  const idx = proyectos.findIndex((p) => p.id === body.id);
  if (idx === -1) return NextResponse.json({ ok: false, msg: "No encontrado" }, { status: 404 });

  proyectos[idx] = {
    ...proyectos[idx],
    titulo: body.titulo ?? proyectos[idx].titulo,
    descripcion: body.descripcion ?? proyectos[idx].descripcion,
    tecnologias: body.tecnologias ?? proyectos[idx].tecnologias,
    categoria: body.categoria ?? proyectos[idx].categoria,
    imagen: body.imagen ?? proyectos[idx].imagen,
    url: body.url ?? null,
    destacado: body.destacado ?? proyectos[idx].destacado,
    orden: body.orden ?? proyectos[idx].orden,
  };
  saveProyectos(proyectos);
  return NextResponse.json({ ok: true, proyecto: proyectos[idx] });
}

export async function DELETE(request: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  const body = await request.json();
  const proyectos = getProyectos().filter((p) => p.id !== body.id);
  saveProyectos(proyectos);
  return NextResponse.json({ ok: true });
}
