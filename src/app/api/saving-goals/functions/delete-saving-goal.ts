import { sql } from '@vercel/postgres'
import { DELETE_SAVING_GOAL } from '../services/saving-goals.service'

export async function deleteSavingGoal(id: string, user_id: string) {
  const registries = await sql`SELECT * FROM saving_goals_register where saving_goal_id = ${id}`

  registries.rows.map(async (registry) => {
    const { amount } = registry
    try {
      await sql`UPDATE accounts SET Value = Value + ${amount}`
    } catch (e) {
      sql`ROLLBACK`
    }
  })

  await sql`DELETE FROM saving_goals_register where saving_goal_id = ${id}`
  await DELETE_SAVING_GOAL({ id, user_id })
}
