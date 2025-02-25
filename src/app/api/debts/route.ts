import { NextResponse } from 'next/server'
import { getParamsDebt } from './params/params'
import { authMiddleware } from '../middleware/auth'
import { handleError } from '../utils/handleError'
import { validateDebtParams } from './validate/validateDebtParams'
import { DELETE_DEBTS, GET_DEBTS, GET_DEBTS_PAYMENTS, INSERT_DEBTS } from './services/debts.service'

export const POST = authMiddleware(async (request, session) => {
    const form = await request.formData()
    const params = getParamsDebt(form)
    console.log(params)
  try {
    validateDebtParams(params)
    await INSERT_DEBTS(
      session.user?.name,
      params.installments,
      params.description,
      params.paydate,
      params.startdate,
      params.totalamount,
      params.interest
    )
    return NextResponse.json({ message: 'ok' }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
})

export const GET = authMiddleware(async (_, session) => {
  try {
    const result = await GET_DEBTS(session.user?.name)
    const updatedRows = await Promise.all(
      result.rows.map(async (item) => {
        const payments = await GET_DEBTS_PAYMENTS(item?.id)
        return { ...item, payments: payments.rows }
      }),
    )
    return NextResponse.json(updatedRows, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
})

export const DELETE = authMiddleware(async (request, session) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')!
  try {
    DELETE_DEBTS(session?.user?.name, parseInt(id))
  } catch (e) {
    return handleError(e)
  }
  return NextResponse.json({ message: 'Debt eliminated' }, { status: 200 })
})
