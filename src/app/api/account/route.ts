import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    if (!body.usernam) throw new Error("User is required");
    if (!body.value || !body.main || !body.name)
      throw new Error("Value, main, name is required");
    await sql`INSERT INTO accounts (Username, Name, Value, Main) VALUES (${body.username}, ${body.name}, ${body.value}, ${body.main});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  const resultInsert =
    await sql`SELECT * FROM accounts where Name = ${body.name} and Owner = ${body.owner}`;
  return NextResponse.json({ resultInsert }, { status: 200 });
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
  const result = await sql`SELECT * FROM accounts where username = ${username}`;
  return NextResponse.json({ ...result }, { status: 200 });
}
