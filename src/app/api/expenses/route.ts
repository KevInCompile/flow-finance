import { NextResponse } from 'next/server'
import { deleteExpense, insertExpense } from './functions'
import { authMiddleware } from '../middleware/auth'
import { handleError } from '../utils/handleError'
import { GET_EXPENSES } from './services/expenses.service'

export const POST = authMiddleware(async (request, session) => {
  try {
    const form = await request.json()
    const result = await insertExpense({
      username: session.user?.name,
      ...form,
    })
    return NextResponse.json({ message: 'Expense added', result: { ...result, type: 'expense' } }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
})

export const GET = authMiddleware(async (_, session) => {
  try {
    const result = await GET_EXPENSES(session.user?.name)
    const response = result.rows.map((row: any) => ({ ...row, type: 'expense' }))
    return NextResponse.json({ result: response }, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
})

export const DELETE = authMiddleware(async (request, session) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return handleError('Id is missing')
  try {
    await deleteExpense(id, session.user?.name)
    return NextResponse.json({ message: 'Expense deleted' }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
})
