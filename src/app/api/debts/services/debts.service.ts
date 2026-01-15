import { sql } from '@vercel/postgres'
const INSERT_DEBTS = async (
  username: string | null | undefined,
  installments: number,
  description: string,
  startdate: string,
  totalamount: number,
  interest: number
) => {
  try {
    const result = await sql`
      INSERT INTO debts (username, installments, description, interest, total_amount, start_date)
      VALUES (${username}, ${installments}, ${description}, ${interest}, ${totalamount}, ${startdate})
      RETURNING id
    `

    if (!result.rows || result.rows.length === 0) {
      throw new Error('No se pudo obtener el ID de la deuda insertada')
    }

    const debtId = result.rows[0].id
    console.log('✅ Deuda creada con ID:', debtId)

    // Calcular cuántas cuotas están vencidas
    const startDate = new Date(startdate + 'T12:00:00')
    const currentDate = new Date()

    // Validar fecha
    if (isNaN(startDate.getTime())) {
      console.error('❌ Fecha de inicio inválida:', startdate)
      throw new Error('Fecha de inicio inválida')
    }

    // El día de pago mensual es el día de la fecha de inicio
    const payDay = startDate.getDate()

    let dueInstallments = 0

    // Si la fecha de inicio es hoy o en el futuro, no hay cuotas vencidas
    if (startDate >= currentDate) {
      dueInstallments = 0
    } else {
      // Contar cuántas fechas de pago YA HAN PASADO (no las que están por venir)
      let paymentDate = new Date(startDate)

      // Avanzar al primer día de pago (1 mes después del inicio)
      paymentDate.setMonth(paymentDate.getMonth() + 1)

      // Ajustar el día de pago
      const daysInFirstMonth = new Date(
        paymentDate.getFullYear(),
        paymentDate.getMonth() + 1,
        0
      ).getDate()

      if (payDay > daysInFirstMonth) {
        paymentDate.setDate(daysInFirstMonth)
      } else {
        paymentDate.setDate(payDay)
      }

      // Contar cuántas fechas de pago YA PASARON (< currentDate, NO <=)
      while (paymentDate < currentDate && dueInstallments < installments) {
        dueInstallments++
        // Avanzar al siguiente mes
        paymentDate.setMonth(paymentDate.getMonth() + 1)

        // Ajustar el día si el mes no tiene ese día
        const daysInMonth = new Date(
          paymentDate.getFullYear(),
          paymentDate.getMonth() + 1,
          0
        ).getDate()

        if (payDay > daysInMonth) {
          paymentDate.setDate(daysInMonth)
        } else {
          paymentDate.setDate(payDay)
        }
      }
    }

    // Si hay cuotas vencidas, generar pagos automáticos
    if (dueInstallments > 0) {

      try {
        await GENERATE_AUTOMATIC_PAYMENTS(
          debtId,
          totalamount,
          interest,
          installments,
          startDate,
          payDay,
          dueInstallments
        )
      } catch (paymentError) {
      }
    } else {
    }

    return result

  } catch (error: any) {
    console.error('💥 ERROR EN INSERT_DEBTS:', {
      message: error.message,
      stack: error.stack
    })
    throw error
  }
}

const GENERATE_AUTOMATIC_PAYMENTS = async (
  debtId: number,
  principal: number,
  annualInterestRate: number,
  installments: number,
  startDate: Date,
  payDay: number,
  dueInstallments: number
) => {
  if (dueInstallments <= 0) {
    console.log('⏭️ No hay cuotas vencidas, no se generan pagos automáticos')
    return 0
  }

  // Calcular tabla de amortización
  const monthlyPayment = CALCULATE_MONTHLY_PAYMENT(principal, annualInterestRate, installments)
  const monthlyInterestRate = annualInterestRate / 100 / 12

  console.log('💵 Cuota mensual:', monthlyPayment.toFixed(2))

  let remainingBalance = principal
  let paymentsGenerated = 0

  // Generar pagos para las cuotas vencidas
  for (let month = 1; month <= dueInstallments; month++) {
    try {
      // Calcular fecha de pago para esta cuota
      // La primera cuota es 1 mes después de la fecha de inicio
      let paymentDate = new Date(startDate)
      paymentDate.setMonth(startDate.getMonth() + month)

      // Ajustar el día de pago
      const daysInMonth = new Date(
        paymentDate.getFullYear(),
        paymentDate.getMonth() + 1,
        0
      ).getDate()

      const actualPayDay = Math.min(payDay, daysInMonth)
      paymentDate.setDate(actualPayDay)

      // Calcular interés y capital para este mes
      const interestForMonth = remainingBalance * monthlyInterestRate
      const capitalForMonth = monthlyPayment - interestForMonth

      // Actualizar saldo pendiente
      remainingBalance -= capitalForMonth

      // No permitir saldo negativo
      if (remainingBalance < 0) remainingBalance = 0

      // Insertar pago automático
      await sql`
        INSERT INTO payments (debts_id, payment_type, pay_value, pay_day, capital_paid, interest_paid)
        VALUES (
          ${debtId},
          'automatic',
          ${monthlyPayment},
          ${paymentDate.toISOString().split('T')[0]},
          ${capitalForMonth},
          ${interestForMonth}
        )
      `

      paymentsGenerated++

    } catch (error: any) {
      console.error(`❌ Error insertando pago automático mes ${month}:`, {
        message: error.message,
        code: error.code,
        detail: error.detail
      })
      // Continuar con los siguientes pagos
    }
  }

  return paymentsGenerated
}

const GET_DEBTS = (username: string | null | undefined) => sql`SELECT * FROM debts where Username = ${username}`

const GET_DEBTS_PAYMENTS = (id: number) => sql`SELECT * FROM payments WHERE debts_id = ${id} ORDER BY pay_day ASC`

const DELETE_DEBTS = async (username: string | null | undefined, id: number) => {
  await sql`DELETE FROM payments WHERE debts_id = ${id}`
  await sql`DELETE FROM debts WHERE id = ${id} AND username = ${username}`
}

// Función para calcular interés acumulado diario considerando pagos y cuotas vencidas
const CALCULATE_ACCUMULATED_INTEREST = async (debtId: number) => {
  try {
    const debtResult = await sql`SELECT * FROM debts WHERE id = ${debtId}`

    if (debtResult.rows.length === 0) {
      throw new Error('Deuda no encontrada')
    }
    const debt = debtResult.rows[0]

    const interestRate = parseFloat(debt.interest) || 0
    const principal = parseFloat(debt.total_amount) || 0

    // Manejar la fecha
    let startDate
    if (debt.start_date instanceof Date) {
      startDate = new Date(debt.start_date)
    } else {
      startDate = new Date(debt.start_date + 'T12:00:00')
    }

    if (isNaN(startDate.getTime())) {
      return parseFloat(debt.accumulated_interest) || 0
    }

    const payDay = startDate.getDate()
    const installments = parseInt(debt.installments) || 0

    if (interestRate <= 0 || principal <= 0 || installments <= 0) {
      return parseFloat(debt.accumulated_interest) || 0
    }

    // Obtener pagos reales
    const paymentsResult = await sql`
      SELECT *,
        COALESCE(capital_paid, 0) as capital_paid,
        COALESCE(interest_paid, 0) as interest_paid,
        pay_day
      FROM payments
      WHERE debts_id = ${debtId}
      ORDER BY pay_day ASC
    `
    const payments = paymentsResult.rows

    const totalCapitalPaid = payments.reduce((sum, payment) => {
      return sum + (parseFloat(payment.capital_paid) || 0)
    }, 0)

    const totalInterestPaid = payments.reduce((sum, payment) => {
      return sum + (parseFloat(payment.interest_paid) || 0)
    }, 0)

    const currentBalance = Math.max(0, principal - totalCapitalPaid)

    if (currentBalance <= 0) {
      return parseFloat(debt.accumulated_interest) || 0
    }

    const currentDate = new Date()

    // Calcular cuántas cuotas DEBERÍAN estar vencidas (teórico)
    let dueInstallments = 0

    if (startDate < currentDate) {
      let paymentDate = new Date(startDate)
      paymentDate.setMonth(paymentDate.getMonth() + 1)

      const daysInFirstMonth = new Date(
        paymentDate.getFullYear(),
        paymentDate.getMonth() + 1,
        0
      ).getDate()

      paymentDate.setDate(payDay > daysInFirstMonth ? daysInFirstMonth : payDay)

      while (paymentDate < currentDate && dueInstallments < installments) {
        dueInstallments++
        paymentDate.setMonth(paymentDate.getMonth() + 1)

        const daysInMonth = new Date(
          paymentDate.getFullYear(),
          paymentDate.getMonth() + 1,
          0
        ).getDate()

        paymentDate.setDate(payDay > daysInMonth ? daysInMonth : payDay)
      }
    }

    // Calcular cuota mensual
    const monthlyPayment = CALCULATE_MONTHLY_PAYMENT(principal, interestRate, installments)
    const dailyInterestRate = interestRate / 100 / 365
    const monthlyInterestRate = interestRate / 100 / 12

    // Calcular interés SOLO del período actual (desde último pago hasta hoy)
    let accumulatedInterest = 0

    if (payments.length > 0) {
      // HAY PAGOS: calcular interés solo desde el último pago
      const lastPayment = payments[payments.length - 1]
      const lastPaymentDate = lastPayment.pay_day instanceof Date
        ? new Date(lastPayment.pay_day)
        : new Date(lastPayment.pay_day)

      const daysSinceLastPayment = Math.max(0, Math.floor(
        (currentDate.getTime() - lastPaymentDate.getTime()) / (1000 * 3600 * 24)
      ))

      // Calcular el saldo después de todos los pagos realizados
      let balanceAfterPayments = principal
      for (let i = 0; i < payments.length; i++) {
        const capitalPaid = parseFloat(payments[i].capital_paid) || 0
        balanceAfterPayments -= capitalPaid
      }
      balanceAfterPayments = Math.max(0, balanceAfterPayments)

      // Interés diario sobre el saldo real después de pagos
      accumulatedInterest = balanceAfterPayments * dailyInterestRate * daysSinceLastPayment

    } else if (dueInstallments > 0) {
      // NO HAY PAGOS pero SÍ HAY CUOTAS VENCIDAS
      // Calcular interés de todas las cuotas vencidas + período actual

      let balance = principal
      let totalInterestFromDue = 0

      // Interés de cuotas vencidas completas
      for (let month = 1; month <= dueInstallments; month++) {
        const interestForMonth = balance * monthlyInterestRate
        const capitalForMonth = monthlyPayment - interestForMonth

        totalInterestFromDue += interestForMonth
        balance -= capitalForMonth
        if (balance < 0) balance = 0
      }

      // Calcular última fecha de pago teórica
      let lastTheoricalPayment = new Date(startDate)
      lastTheoricalPayment.setMonth(startDate.getMonth() + dueInstallments)

      const daysInMonth = new Date(
        lastTheoricalPayment.getFullYear(),
        lastTheoricalPayment.getMonth() + 1,
        0
      ).getDate()

      lastTheoricalPayment.setDate(payDay > daysInMonth ? daysInMonth : payDay)

      // Días desde última cuota vencida hasta hoy
      const daysSinceLastDue = Math.max(0, Math.floor(
        (currentDate.getTime() - lastTheoricalPayment.getTime()) / (1000 * 3600 * 24)
      ))

      // Interés del período actual
      const currentPeriodInterest = balance * dailyInterestRate * daysSinceLastDue

      accumulatedInterest = totalInterestFromDue + currentPeriodInterest

    } else {
      // NO HAY PAGOS NI CUOTAS VENCIDAS
      // Calcular interés desde el inicio hasta hoy
      const daysSinceStart = Math.max(0, Math.floor(
        (currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      ))

      accumulatedInterest = principal * dailyInterestRate * daysSinceStart
    }

    // Tomar el mayor entre el acumulado anterior y el nuevo cálculo
    const currentAccumulated = parseFloat(debt.accumulated_interest) || 0
    const newAccumulatedInterest = Math.max(currentAccumulated, accumulatedInterest)

    // Actualizar en base de datos
    await sql`
      UPDATE debts
      SET accumulated_interest = ${accumulatedInterest},
          last_interest_calculation = ${currentDate.toISOString().split('T')[0]}
      WHERE id = ${debtId}
    `

    return accumulatedInterest

  } catch (error) {
    console.error('💥 ERROR EN CALCULATE_ACCUMULATED_INTEREST:', error)
    return 0
  }
}

// Función para calcular cuota mensual con amortización francesa (cuota fija)
const CALCULATE_MONTHLY_PAYMENT = (principal: number, annualInterestRate: number, months: number): number => {
  if (annualInterestRate <= 0) {
    // Sin interés, cuota simple
    return principal / months
  }

  // Convertir tasa anual a tasa mensual
  const monthlyInterestRate = annualInterestRate / 100 / 12

  // Fórmula de amortización francesa: Cuota = P * [i(1+i)^n] / [(1+i)^n - 1]
  // Donde:
  // P = principal (monto del préstamo)
  // i = tasa de interés mensual
  // n = número de cuotas (meses)

  const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)
  const denominator = Math.pow(1 + monthlyInterestRate, months) - 1

  if (denominator === 0) {
    return principal / months
  }

  const monthlyPayment = principal * (numerator / denominator)

  return monthlyPayment
}

// Función para generar tabla de amortización
const GENERATE_AMORTIZATION_TABLE = (principal: number, annualInterestRate: number, months: number) => {
  const monthlyPayment = CALCULATE_MONTHLY_PAYMENT(principal, annualInterestRate, months)
  const monthlyInterestRate = annualInterestRate / 100 / 12

  let remainingBalance = principal
  const amortizationTable = []

  for (let month = 1; month <= months; month++) {
    const interestPayment = remainingBalance * monthlyInterestRate
    const principalPayment = monthlyPayment - interestPayment
    remainingBalance -= principalPayment

    amortizationTable.push({
      month,
      payment: monthlyPayment,
      interest: interestPayment,
      principal: principalPayment,
      remainingBalance: remainingBalance > 0 ? remainingBalance : 0
    })
  }

  return {
    monthlyPayment,
    totalPayment: monthlyPayment * months,
    totalInterest: monthlyPayment * months - principal,
    amortizationTable
  }
}

// Función para obtener deudas con interés actualizado y cálculo de cuotas
const GET_DEBTS_WITH_UPDATED_INTEREST = async (username: string | null | undefined) => {
  const debtsResult = await GET_DEBTS(username)

  // Actualizar interés para cada deuda
  const updatedDebts = await Promise.all(
    debtsResult.rows.map(async (debt: any) => {
      const accumulatedInterest = await CALCULATE_ACCUMULATED_INTEREST(debt.id)
      const totalAmount = parseFloat(debt.total_amount) || 0
      const interestRate = parseFloat(debt.interest) || 0
      const installments = parseInt(debt.installments) || 1

      // Obtener pagos con desglose
      const paymentsResult = await sql`SELECT *, COALESCE(capital_paid, 0) as capital_paid, COALESCE(interest_paid, 0) as interest_paid FROM payments WHERE debts_id = ${debt.id} ORDER BY pay_day ASC`
      const payments = paymentsResult.rows

      // Calcular totales de pagos
      const totalCapitalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.capital_paid || 0), 0)
      const totalInterestPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.interest_paid || 0), 0)
      const totalPaid = totalCapitalPaid + totalInterestPaid
      const remainingCapital = Math.max(0, totalAmount - totalCapitalPaid)

      // Calcular cuota mensual con amortización
      const monthlyPayment = CALCULATE_MONTHLY_PAYMENT(totalAmount, interestRate, installments)

      // Generar tabla de amortización completa
      const amortizationInfo = GENERATE_AMORTIZATION_TABLE(totalAmount, interestRate, installments)

      return {
        ...debt,
        accumulated_interest: accumulatedInterest,
        total_with_interest: parseFloat(totalAmount) + parseFloat(accumulatedInterest),
        monthly_payment: monthlyPayment,
        total_payment: amortizationInfo.totalPayment,
        total_interest: amortizationInfo.totalInterest,
        amortization_table: amortizationInfo.amortizationTable,
        payments: payments,
        payment_summary: {
          total_capital_paid: totalCapitalPaid,
          total_interest_paid: totalInterestPaid,
          total_paid: totalPaid,
          remaining_capital: remainingCapital,
          remaining_balance: remainingCapital + accumulatedInterest - totalInterestPaid
        }
      }
    })
  )

  return { rows: updatedDebts }
}

export {
  INSERT_DEBTS,
  GET_DEBTS,
  GET_DEBTS_WITH_UPDATED_INTEREST,
  GET_DEBTS_PAYMENTS,
  DELETE_DEBTS,
  CALCULATE_ACCUMULATED_INTEREST
}
