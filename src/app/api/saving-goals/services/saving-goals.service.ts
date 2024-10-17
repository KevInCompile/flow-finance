import { sql } from '@vercel/postgres'

type savingGoal = {
  id: string
  username: string | null | undefined
}

const SELECT_SAVING_GOALS = (username: string) => {
  return sql`SELECT * FROM saving_goals where username=${username}`
}

const DELETE_SAVING_GOAL = ({ username, id }: savingGoal) => {
  return sql`DELETE FROM saving_goals WHERE Id = ${id} and username = ${username}`
}

export { SELECT_SAVING_GOALS, DELETE_SAVING_GOAL }
