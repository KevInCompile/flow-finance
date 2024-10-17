import { NextResponse } from 'next/server'

export const handleError = (error: unknown, status?: number) => {
  return NextResponse.json({ error }, { status: status ?? 500 })
}
