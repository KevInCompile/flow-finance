import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { getParams } from '../utils/params';

export async function POST(request: Request) {
  const form = await request.formData()
  const {name, value, username, type} =  getParams(form)
  
  try {
    if (!username) return NextResponse.json({error: "User is required"}, { status: 500 });
    if (!value || !name) return NextResponse.json({error: "Value, main, name is required"}, { status: 500 });
    await sql`INSERT INTO accounts (Username, Name, Value, Type) VALUES (${username}, ${name}, ${value}, ${type})`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ 'message': 'ok'}, { status: 200 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  try {
    if (!username)
      return NextResponse.json({ error: "Username is missing" }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  const result = await sql`SELECT * FROM accounts where Username = ${username}`;
  return NextResponse.json({ ...result }, { status: 200 });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if(!id) return NextResponse.json({ error: "Id is missing" }, { status: 500 });
  const form = await request.formData()
  const name = form.get('name') as string
  const value = parseFloat(form.get('value')!.toString().replace(/,/g, ''))
  try {
    await sql`UPDATE accounts SET Name = ${name}, Value = ${value} WHERE Id = ${id}`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ 'message': 'Account updated'}, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if(!id) return NextResponse.json({ error: "Id is missing" }, { status: 500 });
  try {
    await sql`DELETE FROM accounts WHERE Id = ${id}`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ 'message': 'Account deleted'}, { status: 200 });
}
