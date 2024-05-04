import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextResponse) {
  let cookie = cookies().get("next-auth.session-token");
  const response = NextResponse.next();

  if (!cookie) return NextResponse.redirect(new URL("/forbbiden", req.url));
  return response;
}

export const config = { matcher: ["/app/:path*"] };
