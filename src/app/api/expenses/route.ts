import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { getParams } from "../utils/params";

export async function POST(request: Request) {
  const form = await request.formData()
  const {username, value, accountId, categoryId, description} = getParams(form)
  
  try {
    await sql`INSERT INTO expenses (AccountId, CategoryId, Username, Description, Value) VALUES (${accountId}, ${categoryId}, ${username}, ${description}, ${value});`
    await sql`UPDATE accounts
    SET Value = Value - ${value}
    WHERE Id = ${accountId} AND Username = ${username}`;
  } catch (error) {
    NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ 'message': 'ok'}, { status: 200 });
}

export async function GET(){
  try {
    const result = await sql`SELECT e.Id, a.Name AS AccountName, c.Name AS CategoryName, e.Username, e.Date, e.Description, e.Value
    FROM expenses AS e
    INNER JOIN accounts AS a ON e.AccountId = a.Id
    INNER JOIN categories AS c ON e.CategoryId = c.Id;`;
    return NextResponse.json({ ...result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}