import { sql } from '@vercel/postgres'

export async function insertNewSavingGoal(data: any) {
  const { moneySaved: ms, goal: g, nameGoal, user_id } = data
  const moneySaved = parseInt(ms)
  const goal = parseInt(g)

  await sql`INSERT INTO saving_goals (user_id, money_saved, goal, name_goal) VALUES (${user_id}, ${moneySaved}, ${goal}, ${nameGoal});`

  const { rows } = await sql`SELECT * FROM saving_goals where user_id = ${user_id} ORDER BY Id DESC LIMIT 1`

  return rows[0]
}
