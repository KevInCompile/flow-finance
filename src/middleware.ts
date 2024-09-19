import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function middleware(req: NextResponse) {
  let cookie = cookies().get(process.env.NEXT_COOKIE as string)
  const response = NextResponse.next()

  if (!cookie) return NextResponse.redirect(new URL('/forbbiden', req.url))
  return response
}

export const config = { matcher: ['/app/:path*'] }
