import { sql } from "@vercel/postgres";
import { authMiddleware } from "../middleware/auth";
import { handleSuccess } from "../utils/handleSuccess";
import { handleError } from "../utils/handleError";

const createSalary = async (user_id: string, salary_net_monthly: number, hire_date: string, pay_frequency: string) => {
  const salary = await sql`
    INSERT INTO salary_settings (
      user_id,
      salary_net_monthly,
      pay_frequency,
      hire_date
    )
    VALUES (
      ${user_id.trim()},
      ${salary_net_monthly},
      ${pay_frequency},
      ${hire_date}
    )
    RETURNING *;`
  return salary;
};

export const POST = authMiddleware(async (request, session) => {
  try {
    const body = await request.json();
    const { salary_net_monthly, hire_date, pay_frequency } = body;
    const salary = await createSalary(session.user?.id!, salary_net_monthly, hire_date, pay_frequency);
    const result = salary.rows[0];

    return handleSuccess("Salary settings created successfully", 201, result);
  } catch (error) {
    console.error("Error creating salary settings:", error);
    return handleError(error, 500);
  }
});

export const GET = authMiddleware(async (request, session) => {
  try {
    const results = await sql`SELECT * FROM salary_settings where user_id = ${session.user.id}`
    return handleSuccess("Consult successly", 201, results.rows[0])
  } catch (error) {
    console.log(error)
    return handleError(error, 500)
  }
})
