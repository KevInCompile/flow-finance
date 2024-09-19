import { NextResponse } from 'next/server'
import { getSession } from '../session'
import { performExchange } from './function'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Forbidden' }, { status: 401 })

  try {
    const form = await request.json()
    const result = await performExchange({
      username: session?.user?.name!,
      fromAccountId: form.fromAccountId,
      toAccountId: form.toAccountId,
      value: form.value,
    })
    return NextResponse.json(
      {
        message: 'Exchange completed',
        result: { ...result, type: 'exchange' },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
