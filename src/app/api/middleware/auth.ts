import { Session } from 'next-auth'
import { getSession } from '../session'
import { NextResponse } from 'next/server'

export const authMiddleware = (handler: (request: Request, session: Session) => Promise<NextResponse>) => {
  return async (request: Request) => {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 401 })
    return handler(request, session)
  }
}
