import { NextResponse } from 'next/server'

export const handleSuccess = (message: unknown) => {
  return NextResponse.json({ message }, { status: 200 })
}
