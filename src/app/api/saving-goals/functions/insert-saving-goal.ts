import { sql } from '@vercel/postgres'

export async function insertNewSavingGoal(data: any) {
  const { moneySaved: ms, goal: g, nameGoal, username } = data
  const moneySaved = parseFloat(ms)
  const goal = parseFloat(g)

  await sql`INSERT INTO saving_goals (username, moneySaved, goal, nameGoal) VALUES (${username}, ${moneySaved}, ${goal}, ${nameGoal});`

  const { rows } = await sql`SELECT * FROM saving_goals where username = ${username} ORDER BY Id DESC LIMIT 1`

  return rows[0]
}
