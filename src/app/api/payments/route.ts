import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function POST (req: Request) {
  const form = await req.json()
  const {debtID, paymentType, payValue} = form
  const payFormatted = parseFloat(payValue!.toString().replace(/,/g, ''))
  // const data = getParamsPayments(form)

  try {
    if(!debtID) return NextResponse.json({error: 'Debt not found'}, {status: 500})

    // INSERT TO SQL
    await sql`INSERT INTO payments (DebtsId, PaymentType, PayValue) VALUES (${debtID}, ${paymentType}, ${payFormatted})`

    await sql`UPDATE debts SET TotalDue = TotalDue - ${payFormatted} where Id = ${debtID}`

  }catch(error){
    return NextResponse.json({error}, {status: 500})
  }
  return NextResponse.json({ 'message': 'ok'}, {status: 200})
}
