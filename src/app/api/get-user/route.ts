import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { getSession } from '../session'

export async function GET() {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  try {
    const result = await getUserCurrency(session.user?.name!)
    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const { currency } = await req.json()

  if (currency === '')
    return NextResponse.json({ error: 'Currency is required' }, { status: 400 })

  try {
    await updateUserCurrency(session.user?.name!, currency)
    return NextResponse.json(
      { message: 'Currency updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

async function getUserCurrency(username: string) {
  const { rows } =
    await sql`SELECT currency FROM user_currency_preferences WHERE username = ${username}`
  return rows.length > 0 ? rows[0].currency : null
}

async function updateUserCurrency(username: string, currency: string) {
  await sql`INSERT INTO user_currency_preferences (username, currency) VALUES (${username}, ${currency}) ON CONFLICT (username) DO UPDATE SET currency = ${currency}`
}
