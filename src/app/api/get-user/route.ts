import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

async function getUserCurrency(username: string) {
  const { rows } =
    await sql`SELECT currency FROM user_currency_preferences WHERE username = ${username}`
  return rows.length > 0 ? rows[0].currency : null
}

async function updateUserCurrency(username: string, currency: string) {
  await sql`INSERT INTO user_currency_preferences (username, currency)
            VALUES (${username}, ${currency})
            ON CONFLICT (username) DO UPDATE SET currency = ${currency}`
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userEncode = searchParams.get('username') as string
  const username = decodeURIComponent(userEncode)

  try {
    const result = await getUserCurrency(username)
    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const { username: userEncode, currency } = await req.json()
  const username = decodeURIComponent(userEncode)

  if (currency === '')
    return NextResponse.json({ error: 'Currency is required' }, { status: 400 })

  try {
    await updateUserCurrency(username, currency)
    return NextResponse.json(
      { message: 'Currency updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
