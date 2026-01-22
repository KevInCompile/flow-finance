import { sql } from "@vercel/postgres";
import { accountType } from "../types/account.type";

const INSERT_ACCOUNTS = (account: accountType) =>
  sql`INSERT INTO accounts (user_id, name, value, type) VALUES (${account.user_id}, ${account.name}, ${account.value}, ${account.type})`;

const GET_LAST_ACCOUNT = (user_id: string) =>
  sql`SELECT * FROM accounts WHERE user_id = ${user_id} ORDER BY Id DESC LIMIT 1`;

const GET_ACCOUNTS = (user_id: string) => sql`SELECT *
FROM accounts
WHERE user_id = ${user_id}
ORDER BY
  CASE type
    WHEN 'main' THEN 1
    WHEN 'savings' THEN 2
    WHEN 'investment' THEN 3
    ELSE 4
  END;`;

const UPDATE_ACCOUNT = (account: accountType) =>
  sql`UPDATE accounts SET Name = ${account.name}, Value = ${account.value} WHERE id = ${account.id} and user_id = ${account.user_id}`;

const DELETE_ACCOUNT = async (account: accountType) => {
  await sql`DELETE from incomes where account_id = ${account.id}`
  await sql`DELETE from expenses where account_id = ${account.id}`
  await sql`DELETE FROM accounts WHERE Id = ${account.id} and user_id = ${account.user_id}`;
}

export {
  INSERT_ACCOUNTS,
  GET_LAST_ACCOUNT,
  GET_ACCOUNTS,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
};
