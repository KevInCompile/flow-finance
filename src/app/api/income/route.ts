import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const form = await req.json()
  const {username: userEncode, typeIncome, value:valueString, accountId, date} = form
  const value = parseFloat(valueString!.toString().replace(/,/g, ''))
  const username = decodeURIComponent(userEncode as string)

  try{
    if(!username)  return NextResponse.json({error: 'Username is required'}, {status: 500})
    // Insert
    await sql`INSERT INTO incomes (Username, TypeIncome, AccountId, Value, Date) VALUES (${username}, ${typeIncome}, ${accountId}, ${value}, ${date})`
    await sql`UPDATE accounts SET Value = Value + ${value} where Id = ${accountId}`
  }catch(e){
    return NextResponse.json({error: e}, {status: 500})
  }

  return NextResponse.json({message: 'Income register'}, {status: 200})
}

export async function GET(req: Request){
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')

  try{
    const result = await sql`SELECT I.id, I.value, I.typeincome, I.date, C.name as account, I.AccountId FROM incomes as I INNER JOIN accounts as C ON I.AccountId = C.Id where I.Username = ${username}`

    return NextResponse.json({result: result.rows}, {status: 200})
  }catch(e){
    return NextResponse.json({error: e}, {status: 500})
  }
}

export async function DELETE (req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  try{

    const {rows} = await sql`SELECT Value, AccountId FROM incomes where Id = ${id}`
    await sql`UPDATE accounts SET Value = Value - ${rows[0].value} where Id = ${rows[0].accountid}`
    await sql`DELETE FROM incomes where Id = ${id}`
  }catch(e){
    return NextResponse.json({error: e}, {status: 500})
  }

  return NextResponse.json({message: 'Income delete'}, {status: 200})
}
