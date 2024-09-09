import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.json();
  const {
    username: userEncode,
    value: valueString,
    accountId,
    categoryId,
    description,
  } = form;
  const value = parseFloat(valueString!.toString().replace(/,/g, ""));
  const username = decodeURIComponent(userEncode as string);

  try {
    await sql`INSERT INTO expenses (AccountId, CategoryId, Username, Description, Value) VALUES (${+accountId}, ${+categoryId}, ${username}, ${description}, ${value});`;
    await sql`UPDATE accounts
    SET Value = Value - ${value}
    WHERE Id = ${accountId} AND Username = ${username}`;
  } catch (error) {
    NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ message: "ok" }, { status: 200 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  try {
    const result =
      await sql`SELECT e.Id, a.Name AS AccountName, c.Name AS CategoryName, e.Username, e.Date, e.Description, e.Value
    FROM expenses AS e
    INNER JOIN accounts AS a ON e.AccountId = a.Id
    INNER JOIN categories AS c ON e.CategoryId = c.Id where e.Username=${username}`;
    return NextResponse.json(
      {
        result: result.rows.map((row: any) => ({
          ...row,
          type: "expense",
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json({ error: "Id is missing" }, { status: 500 });

  const result = await sql`SELECT * FROM expenses WHERE Id = ${id}`;
  const expense = result.rows[0];
  // Se valida si existe una cuenta para devolver el valor del gasto a la cuenta correspondiente
  if (expense.value) {
    await sql`UPDATE accounts SET Value = Value + ${expense.value} WHERE Id = ${expense.accountid};`;
  }
  try {
    await sql`DELETE FROM expenses WHERE Id = ${id}`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
}
