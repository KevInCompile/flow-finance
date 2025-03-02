import { sql } from '@vercel/postgres'

export async function updateSavingGoal(data: any) {
  const { amount, accountId, savingGoalId } = data
  const parsedAmount = parseFloat(amount)

  await sql`BEGIN`
  try {
    await sql`INSERT INTO saving_goals_register (saving_goal_id, account_id, amount) VALUES (${savingGoalId}, ${accountId}, ${parsedAmount})`
    await sql`UPDATE accounts SET value = value - ${parsedAmount} WHERE id = ${accountId}`
    await sql`UPDATE saving_goals SET money_saved = money_saved + ${parsedAmount} WHERE Id = ${savingGoalId}`
    await sql`COMMIT`

    const { rows } = await sql`SELECT * FROM saving_goals WHERE Id = ${savingGoalId}`
    return rows[0]
  } catch (e) {
    await sql`ROLLBACK`
    throw e
  }
}
