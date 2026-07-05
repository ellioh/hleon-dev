import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/admin", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
  response.cookies.set("hleon_admin_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
