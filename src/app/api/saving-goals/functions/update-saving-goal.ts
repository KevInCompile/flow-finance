import { sql } from '@vercel/postgres'

export async function updateSavingGoal(data: any) {
  const { amount, accountId, savingGoalId } = data
  const parsedAmount = parseFloat(amount)

  await sql`BEGIN`
  try {
    await sql`INSERT INTO saving_goals_register (savinggoalid, accountid, amount) VALUES (${savingGoalId}, ${accountId}, ${parsedAmount})`
    await sql`UPDATE accounts SET value = value - ${parsedAmount} WHERE Id = ${accountId}`
    await sql`UPDATE saving_goals SET moneySaved = moneySaved + ${parsedAmount} WHERE Id = ${savingGoalId}`
    await sql`COMMIT`

    const { rows } = await sql`SELECT * FROM saving_goals WHERE Id = ${savingGoalId}`
    return rows[0]
  } catch (e) {
    await sql`ROLLBACK`
    throw e
  }
}
