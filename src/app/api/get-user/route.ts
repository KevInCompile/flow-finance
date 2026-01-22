import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { authMiddleware } from '../middleware/auth'

export const GET = authMiddleware(async (_, session) => {
  try {
    const result = await getUserCurrency(session.user?.id!)
    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
})

export const POST = authMiddleware(async (req, session) => {
  const { currency } = await req.json()

  if (currency === '') return NextResponse.json({ error: 'Currency is required' }, { status: 400 })

  try {
    await updateUserCurrency(session.user?.id!, currency)
    return NextResponse.json({ message: 'Currency updated successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
})

async function getUserCurrency(user_id: string) {
  const { rows } = await sql`SELECT currency FROM user_currency_preferences WHERE user_id = ${user_id}`
  return rows.length > 0 ? rows[0].currency : null
}

async function updateUserCurrency(user_id: string, currency: string) {
  await sql`INSERT INTO user_currency_preferences (user_id, currency) VALUES (${user_id}, ${currency}) ON CONFLICT (user_id) DO UPDATE SET currency = ${currency}`
}
