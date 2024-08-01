import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { getParamsDebt } from "./params/params"

export async function POST(request: Request){
  const form = await request.formData()
  const {username, fee, description, payday, totaldue, feevalue} = getParamsDebt(form)

  try {
    if(!username) return NextResponse.json({error: 'User is required'}, {status: 500})
    if (!fee || !description || !payday || !totaldue || !feevalue) return NextResponse.json({ error: 'All dates is required' }, {status: 500})

    await sql`INSERT INTO debts (Username, Fee, Description, TotalDue, Payday, FeeValue) VALUES (${username}, ${fee}, ${description}, ${totaldue}, ${payday}, ${feevalue})`

  }catch(error){
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ 'message': 'ok'}, {status: 200})
}

export async function GET(request: Request){
  const {searchParams} = new URL(request.url)
  const username = searchParams.get('username')

  try{
    const result = await sql`SELECT * FROM debts where Username = ${username}`
    return NextResponse.json({...result}, {status: 200})
  }
  catch(error){
    return NextResponse.json(error, { status: 500 });
  }
}
