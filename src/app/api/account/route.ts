import { NextResponse } from 'next/server'
import { getParams } from '../utils/params'
import { authMiddleware } from '../middleware/auth'
import {
  DELETE_ACCOUNT,
  GET_ACCOUNTS,
  GET_LAST_ACCOUNT,
  INSERT_ACCOUNTS,
  UPDATE_ACCOUNT,
} from './services/accounts.service'
import { handleError } from '../utils/handleError'
import { handleSuccess } from '../utils/handleSuccess'

export const POST = authMiddleware(async (request, session) => {
  const form = await request.formData()
  const { name, value, type } = getParams(form)
  if (!value || !name) return handleError('name, value is required')

  try {
    await INSERT_ACCOUNTS({ username: session.user?.name, name, value, type })
    const { rows } = await GET_LAST_ACCOUNT(session.user?.name!)
    return NextResponse.json({ message: 'account inserted', result: rows[0] }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
})

export const GET = authMiddleware(async (_, session) => {
  try {
    const { rows } = await GET_ACCOUNTS(session?.user?.name!)
    return NextResponse.json({ result: rows }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
})

export const PUT = authMiddleware(async (request, session) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const body = await request.json()

  if (!id) return handleError('Id is missing')

  try {
    await UPDATE_ACCOUNT({ id, username: session.user?.name, ...body })
    return handleSuccess('Account updated')
  } catch (error) {
    return handleError(error)
  }
})

export const DELETE = authMiddleware(async (request, session) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return handleError('Id is missing')
  try {
    DELETE_ACCOUNT({ id, username: session.user?.name })
    return handleSuccess('Account deleted')
  } catch (error) {
    return handleError(error)
  }
})
