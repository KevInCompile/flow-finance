import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await sql`SELECT * FROM categories`
  return NextResponse.json({ ...result }, { status: 200 })
}
