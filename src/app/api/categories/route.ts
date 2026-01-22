import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { authMiddleware } from '../middleware/auth'

export const GET = authMiddleware(async (request, session) => {
  const result = await sql`SELECT * FROM categories where user_id = ${session.user?.id}`
  return NextResponse.json({ ...result }, { status: 200 })
})
