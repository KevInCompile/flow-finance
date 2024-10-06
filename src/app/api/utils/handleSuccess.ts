import { NextResponse } from 'next/server'

export const handleSuccess = (message: unknown, status?: number) => {
  return NextResponse.json({ message }, { status: status ?? 200 })
}
