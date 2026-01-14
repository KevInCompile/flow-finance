import { sql } from "@vercel/postgres";
import { accountType } from "../types/account.type";

const INSERT_ACCOUNTS = (account: accountType) =>
  sql`INSERT INTO accounts (username, name, value, type) VALUES (${account.username}, ${account.name}, ${account.value}, ${account.type})`;

const GET_LAST_ACCOUNT = (username: string) =>
  sql`SELECT * FROM accounts WHERE username = ${username} ORDER BY Id DESC LIMIT 1`;

const GET_ACCOUNTS = (username: string) => sql`SELECT *
FROM accounts
WHERE Username = ${username}
ORDER BY
  CASE type
    WHEN 'main' THEN 1
    WHEN 'savings' THEN 2
    WHEN 'investment' THEN 3
    ELSE 4
  END;`;

const UPDATE_ACCOUNT = (account: accountType) =>
  sql`UPDATE accounts SET Name = ${account.name}, Value = ${account.value} WHERE id = ${account.id} and username = ${account.username}`;

const DELETE_ACCOUNT = async (account: accountType) => {
  await sql`DELETE from incomes where account_id = ${account.id}`
  await sql`DELETE from expenses where account_id = ${account.id}`
  await sql`DELETE FROM accounts WHERE Id = ${account.id} and username = ${account.username}`;
}

export {
  INSERT_ACCOUNTS,
  GET_LAST_ACCOUNT,
  GET_ACCOUNTS,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
};
