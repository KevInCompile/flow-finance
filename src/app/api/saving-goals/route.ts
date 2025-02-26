import { authMiddleware } from '../middleware/auth'
import { DELETE_SAVING_GOAL, SELECT_SAVING_GOALS } from './services/saving-goals.service'
import { handleSuccess } from '../utils/handleSuccess'
import { handleError } from '../utils/handleError'
import { updateSavingGoal } from './functions/update-saving-goal'
import { insertNewSavingGoal } from './functions/insert-saving-goal'
import { deleteSavingGoal } from './functions/delete-saving-goal'

export const GET = authMiddleware(async (req, session) => {
  try {
    const { rows } = await SELECT_SAVING_GOALS(session?.user?.name as string)
    if (rows[0]) {
      return handleSuccess('', 200, [...rows])
    } else {
      return handleSuccess('No data', 200, [])
    }
  } catch (e) {
    return handleError(e)
  }
})

export const POST = authMiddleware(async (req, session) => {
  const body = await req.json()
  try {
    const result = await insertNewSavingGoal({ ...body, username: session.user?.name })
    return handleSuccess('Saving goal inserted', 201, result)
  } catch (e) {
    return handleError(e)
  }
})

export const DELETE = authMiddleware(async (req, session) => {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return handleError('Id is missing')

  try {
    await deleteSavingGoal(id, session.user?.name as string)
    return handleSuccess('Item deleted', 200)
  } catch (e) {
    return handleError(e)
  }
})

export const PUT = authMiddleware(async (req) => {
  const body = await req.json()
  if (!body.amount || !body.accountId || !body.savingGoalId) {
    return handleError('amount, accountId, and savingGoalId are required', 400)
  }
  try {
    const result = await updateSavingGoal(body)
    return handleSuccess('Saving goal updated', 200, result)
  } catch (e) {
    return handleError(e)
  }
})
