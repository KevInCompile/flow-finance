import { NextResponse } from 'next/server'

export const handleError = (error: unknown) => {
  return NextResponse.json({ error }, { status: 500 })
}
