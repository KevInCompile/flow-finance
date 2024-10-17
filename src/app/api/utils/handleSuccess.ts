import { NextResponse } from 'next/server'

export const handleSuccess = (message?: unknown, status?: number, result?: unknown) => {
  return NextResponse.json({ message, result }, { status: status ?? 200 })
}
