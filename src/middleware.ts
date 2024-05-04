import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req: NextResponse) {
  let cookie = cookies().get("next-auth.session-token");
  let cookieProd = cookies().get("__Secure-next-auth.session-token");
  const response = NextResponse.next();

  if (!cookieProd) return NextResponse.redirect(new URL("/forbbiden", req.url));
  return response;
}

export const config = { matcher: ["/app/:path*"] };
