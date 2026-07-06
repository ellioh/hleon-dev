import { NextRequest, NextResponse } from "next/server";
import { getPosts, savePost, deletePost } from "@/lib/blog";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json(null, { status: 401 });
  return NextResponse.json(getPosts(false));
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json(null, { status: 401 });
  const body = await request.json();
  const post = savePost(body);
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json(null, { status: 401 });
  const body = await request.json();
  const post = savePost(body);
  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json(null, { status: 401 });
  const { id } = await request.json();
  deletePost(id);
  return NextResponse.json({ ok: true });
}
