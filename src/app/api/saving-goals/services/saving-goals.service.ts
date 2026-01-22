import { sql } from '@vercel/postgres'

type savingGoal = {
  id: string
  user_id: string | null | undefined
}

const SELECT_SAVING_GOALS = (user_id: string) => {
  return sql`SELECT * FROM saving_goals where user_id=${user_id}`
}

const DELETE_SAVING_GOAL = ({ user_id, id }: savingGoal) => {
  return sql`DELETE FROM saving_goals WHERE Id = ${id} and user_id = ${user_id}`
}

export { SELECT_SAVING_GOALS, DELETE_SAVING_GOAL }
