import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result =
      await sql`CREATE TABLE accounts (Id serial PRIMARY KEY, User varchar(100), Name varchar(50), Value int);`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
