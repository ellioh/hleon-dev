import { NextRequest, NextResponse } from "next/server";
import { getPostById } from "@/lib/blog";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) return NextResponse.json(null, { status: 401 });
  const { id } = await params;
  const post = getPostById(id);
  if (!post) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(post);
}
