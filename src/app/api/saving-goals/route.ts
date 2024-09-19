import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { getSession } from '../session'

export async function GET() {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  try {
    const { rows } =
      await sql`SELECT * FROM saving_goals where username=${session.user?.name}`
    if (rows[0]) {
      return NextResponse.json({ result: [rows[0]] }, { status: 200 })
    } else {
      return NextResponse.json(
        { message: 'No data', result: [] },
        { status: 200 }
      )
    }
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()

  try {
    const result = await insertNewSavingGoal(body)
    return NextResponse.json(
      { message: 'Saving goal inserted', result },
      { status: 200 }
    )
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  try {
    await sql`DELETE FROM saving_goals WHERE Id = ${id}`
    return NextResponse.json({ message: 'Item deleted' }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const body = await req.json()
  if (!body.amount || !body.accountId || !body.savingGoalId) {
    return NextResponse.json(
      { error: 'amount, accountId, and savingGoalId are required' },
      { status: 400 }
    )
  }
  try {
    const result = await updateSavingGoal(body)
    return NextResponse.json(
      { message: 'Saving goal updated', result },
      { status: 200 }
    )
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
}

async function insertNewSavingGoal(data: any) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  const { moneySaved: ms, goal: g, nameGoal } = data
  const moneySaved = parseFloat(ms)
  const goal = parseFloat(g)

  await sql`INSERT INTO saving_goals (username, moneySaved, goal, nameGoal) VALUES (${session.user?.name}, ${moneySaved}, ${goal}, ${nameGoal});`

  const { rows } =
    await sql`SELECT * FROM saving_goals where username = ${session.user?.name} ORDER BY Id DESC LIMIT 1`

  return rows[0]
}

async function updateSavingGoal(data: any) {
  const { amount, accountId, savingGoalId } = data
  const parsedAmount = parseFloat(amount)

  await sql`BEGIN`
  try {
    await sql`INSERT INTO saving_goals_register (savinggoalid, accountid, amount) VALUES (${savingGoalId}, ${accountId}, ${parsedAmount})`
    await sql`UPDATE accounts SET value = value - ${parsedAmount} WHERE Id = ${accountId}`
    await sql`UPDATE saving_goals SET moneySaved = moneySaved + ${parsedAmount} WHERE Id = ${savingGoalId}`
    await sql`COMMIT`

    const { rows } =
      await sql`SELECT * FROM saving_goals WHERE Id = ${savingGoalId}`
    return rows[0]
  } catch (e) {
    await sql`ROLLBACK`
    throw e
  }
}
