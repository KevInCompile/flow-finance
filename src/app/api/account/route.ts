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
  const result = await sql`SELECT *
  FROM accounts
  WHERE Username = ${username}
  ORDER BY
    CASE type
      WHEN 'principal' THEN 1
      WHEN 'ahorros' THEN 2
      WHEN 'inversion' THEN 3
      ELSE 4
    END;`;
  return NextResponse.json({ ...result }, { status: 200 });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json()

  // se valida si existe el id de la cuenta
  if(!id) return NextResponse.json({ error: "Id is missing" }, { status: 500 });


  try {
    await sql`UPDATE accounts SET Name = ${body.name}, Value = ${body.value} WHERE Id = ${id}`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ 'message': 'Cuenta actualizada'}, { status: 200 });
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
