import { authMiddleware } from "../middleware/auth";
import {
  DELETE_PAYMENTS,
  INSERT_PAYMENTS,
  SELECT_PAYMENTS,
  UPDATE_FORMATT_PAYMENTS,
  UPDATE_PAYMENTS,
} from "./services/payments.service";
import { handleError } from "../utils/handleError";
import { handleSuccess } from "../utils/handleSuccess";

export const POST = authMiddleware(async (req) => {
  const form = await req.json();
  const { debtID, paymentType, payValue } = form;

  if (!debtID) return handleError("Id is required");

  try {
    // INSERT TO SQL
    await INSERT_PAYMENTS(debtID, paymentType, payValue);

    // await UPDATE_FORMATT_PAYMENTS(payFormatted, debtID);
  } catch (error) {
    return handleError(error);
  }
  return handleSuccess("OK", 201);
});

export const DELETE = authMiddleware(async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) return handleError("Id is required");

    const result = await SELECT_PAYMENTS(id);
    const { debtsid, payvalue } = result.rows[0];
    if (payvalue) {
      await UPDATE_PAYMENTS(payvalue, debtsid);
      await DELETE_PAYMENTS(id);
    }
    return handleSuccess("Payment deleted");
  } catch (e) {
    return handleError(e);
  }
});
