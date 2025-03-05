'use server'

import { sql } from "@vercel/postgres"

export async function deleteCategory(id: number) {
  try {
    const deleteQuery = await sql`DELETE FROM categories where id = ${id}`
    if(deleteQuery.rowCount === 0) {
      throw new Error('Category not found')
    }else{
      return {success: 'Categoria eliminada correctamente'}    }
  } catch (error) {
    throw error
  }
}
