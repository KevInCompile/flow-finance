import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { getParams } from '../utils/params'
import { getSession } from '../session'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const form = await request.formData()
  const { name, value, type } = getParams(form)

  try {
    if (!value || !name)
      return NextResponse.json(
        { error: 'Value, main, name is required' },
        { status: 500 }
      )
    await sql`INSERT INTO accounts (Username, Name, Value, Type) VALUES (${session.user?.name}, ${name}, ${value}, ${type})`
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ message: 'ok' }, { status: 200 })
}

export async function GET() {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  try {
    const result = await sql`SELECT *
    FROM accounts
    WHERE Username = ${session.user?.name}
    ORDER BY
      CASE type
        WHEN 'main' THEN 1
        WHEN 'savings' THEN 2
        WHEN 'investment' THEN 3
        ELSE 4
      END;`
    return NextResponse.json({ ...result }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const body = await request.json()

  // se valida si existe el id de la cuenta
  if (!id) return NextResponse.json({ error: 'Id is missing' }, { status: 500 })

  try {
    await sql`UPDATE accounts SET Name = ${body.name}, Value = ${body.value} WHERE Id = ${id} and username = ${session?.user?.name}`
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ message: 'Account updated' }, { status: 200 })
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Id is missing' }, { status: 500 })
  try {
    await sql`DELETE FROM accounts WHERE Id = ${id} and username = ${session.user?.name}`
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ message: 'Account deleted' }, { status: 200 })
}
