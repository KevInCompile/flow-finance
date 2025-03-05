'use server'

import { getSession } from "@/app/api/session";
import { sql } from "@vercel/postgres";

export async function createCategory(formData: FormData) {
  const session = await getSession()
  const name = formData.get('name') as string;
  const color = formData.get('color') as string;

  if(!session || !name || !color) {
    throw new Error('Invalid input');
  }

  try {
    const insertedCategory = await sql`
      INSERT INTO categories (name, color, username)
      VALUES (${name}, ${color}, ${session?.user?.name})
      RETURNING *`
    return insertedCategory.rows[0];
  } catch (error) {
    throw new Error('Failed to create category');
  }
}
