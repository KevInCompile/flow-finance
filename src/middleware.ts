import { NextResponse } from "next/server";

export async function middleware(req: NextResponse) {
  try {
    if (window.localStorage.token) return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/forbbiden", req.url));
  }
}

export const config = { matcher: ["/app"] };
