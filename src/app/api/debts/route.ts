import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { getParamsDebt } from './params/params'
import { getSession } from '../session'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const form = await request.formData()
  const { fee, description, payday, totaldue, feevalue } = getParamsDebt(form)

  try {
    if (!fee || !description || !payday || !totaldue || !feevalue)
      return NextResponse.json(
        { error: 'All dates is required' },
        { status: 500 }
      )

    await sql`INSERT INTO debts (Username, Fee, Description, TotalDue, Payday, FeeValue) VALUES (${session.user?.name}, ${fee}, ${description}, ${totaldue}, ${payday}, ${feevalue})`
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
    const result =
      await sql`SELECT * FROM debts where Username = ${session.user?.name}`
    const updatedRows = await Promise.all(
      result.rows.map(async (item) => {
        const payments =
          await sql`SELECT * FROM payments WHERE DebtsId = ${item.id}`
        return { ...item, payments: payments.rows }
      })
    )
    return NextResponse.json(updatedRows, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    await sql`DELETE FROM debts WHERE id = ${id} AND username = ${session.user?.name}`
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
  return NextResponse.json({ message: 'Debt eliminated' }, { status: 200 })
}
