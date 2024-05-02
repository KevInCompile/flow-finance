import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: NextResponse) {
  const form = await request.formData()
  const name = form.get('name') as string
  const value = parseFloat(form.get('value')!.toString().replace(/,/g, ''))
  const username = decodeURIComponent(form.get('username') as string)

  try {
    if (!username) return NextResponse.json({error: "User is required"}, { status: 500 });
    if (!value || !name) return new Error("Value, main, name is required");
    await sql`INSERT INTO accounts (Username, Name, Value) VALUES (${username}, ${name}, ${value})`;
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
