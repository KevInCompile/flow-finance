import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { authMiddleware } from '../../middleware/auth'

export const GET = authMiddleware(async (_, session) => {
  try {
    console.log('🔍 [DEBUG] Checking accumulated_interest values for user:', session.user?.name)
    
    // Get all debts for the user
    const debtsResult = await sql`
      SELECT id, description, interest, total_amount, accumulated_interest, 
             start_date, pay_date, installments, last_interest_calculation
      FROM debts 
      WHERE user_id = ${session.user?.id}
      ORDER BY id
    `
    
    const debts = debtsResult.rows
    
    console.log(`📊 [DEBUG] Found ${debts.length} debts for user`)
    
    // Analyze each debt
    const analyzedDebts = debts.map(debt => {
      const interestRaw = debt.interest
      const totalAmountRaw = debt.total_amount
      const accumulatedInterestRaw = debt.accumulated_interest
      
      const interest = parseFloat(interestRaw) || 0
      const totalAmount = parseFloat(totalAmountRaw) || 0
      const accumulatedInterest = parseFloat(accumulatedInterestRaw) || 0
      
      const isInterestNaN = isNaN(interest)
      const isTotalAmountNaN = isNaN(totalAmount)
      const isAccumulatedInterestNaN = isNaN(accumulatedInterest)
      
      // Check if start_date is valid
      const startDate = new Date(debt.start_date + 'T12:00:00')
      const isStartDateValid = !isNaN(startDate.getTime())
      
      // Calculate days since start if date is valid
      let daysSinceStart = 0
      if (isStartDateValid) {
        const currentDate = new Date()
        daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
      }
      
      // Calculate what accumulated_interest should be
      let calculatedInterest = 0
      if (interest > 0 && isStartDateValid && daysSinceStart > 0) {
        const dailyInterestRate = interest / 100 / 365
        calculatedInterest = totalAmount * dailyInterestRate * daysSinceStart
        calculatedInterest = Math.round(calculatedInterest * 100) / 100
      }
      
      return {
        id: debt.id,
        description: debt.description,
        interest: {
          raw: interestRaw,
          parsed: interest,
          isNaN: isInterestNaN
        },
        total_amount: {
          raw: totalAmountRaw,
          parsed: totalAmount,
          isNaN: isTotalAmountNaN
        },
        accumulated_interest: {
          raw: accumulatedInterestRaw,
          parsed: accumulatedInterest,
          isNaN: isAccumulatedInterestNaN,
          type: typeof accumulatedInterestRaw
        },
        dates: {
          start_date: debt.start_date,
          is_start_date_valid: isStartDateValid,
          days_since_start: daysSinceStart,
          last_interest_calculation: debt.last_interest_calculation,
          pay_date: debt.pay_date
        },
        installments: debt.installments,
        calculated_interest: calculatedInterest,
        difference: calculatedInterest - accumulatedInterest,
        needs_fix: isAccumulatedInterestNaN || accumulatedInterest < 0 || accumulatedInterestRaw === 'NaN' || accumulatedInterestRaw === ''
      }
    })
    
    // Count problems
    const problems = analyzedDebts.filter(debt => debt.needs_fix)
    const nanProblems = analyzedDebts.filter(debt => debt.accumulated_interest.isNaN)
    const negativeProblems = analyzedDebts.filter(debt => debt.accumulated_interest.parsed < 0)
    const stringNaNProblems = analyzedDebts.filter(debt => debt.accumulated_interest.raw === 'NaN')
    
    console.log(`⚠️ [DEBUG] Found ${problems.length} debts with problems:`)
    console.log(`   - ${nanProblems.length} with NaN values`)
    console.log(`   - ${negativeProblems.length} with negative values`)
    console.log(`   - ${stringNaNProblems.length} with string "NaN" values`)
    
    // Return detailed analysis
    return NextResponse.json({
      user: session.user?.name,
      total_debts: debts.length,
      problems_summary: {
        total: problems.length,
        nan: nanProblems.length,
        negative: negativeProblems.length,
        string_nan: stringNaNProblems.length
      },
      debts: analyzedDebts,
      debug_info: {
        timestamp: new Date().toISOString(),
        server_time: new Date().toString()
      }
    }, { status: 200 })
    
  } catch (error) {
    console.error('❌ [DEBUG] Error in debug endpoint:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze accumulated_interest',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
})

// POST endpoint to fix NaN values
export const POST = authMiddleware(async (request, session) => {
  try {
    const { fix_all = false, debt_ids = [] } = await request.json()
    
    console.log(`🔧 [DEBUG] Fixing accumulated_interest for user: ${session.user?.name}`)
    console.log(`   - fix_all: ${fix_all}`)
    console.log(`   - debt_ids: ${debt_ids.length > 0 ? debt_ids.join(', ') : 'none'}`)
    
    // Get debts that need fixing
    let query = sql`
      SELECT id, description, interest, total_amount, accumulated_interest, start_date
      FROM debts 
      WHERE user_id = ${session.user?.id}
    `
    
    if (!fix_all && debt_ids.length > 0) {
      query = sql`
        SELECT id, description, interest, total_amount, accumulated_interest, start_date
        FROM debts 
        WHERE user_id = ${session.user?.id}
          AND id IN (${debt_ids})
      `
    }
    
    const debtsResult = await query
    const debts = debtsResult.rows
    
    console.log(`📊 [DEBUG] Found ${debts.length} debts to process`)
    
    const fixes = []
    const errors = []
    
    for (const debt of debts) {
      try {
        const debtId = debt.id
        const currentValue = debt.accumulated_interest
        const parsedCurrent = parseFloat(currentValue) || 0
        
        // Skip if value is already valid
        if (!isNaN(parsedCurrent) && parsedCurrent >= 0 && currentValue !== 'NaN' && currentValue !== '') {
          console.log(`   ⏭️  Debt ${debtId} already has valid value: ${currentValue}`)
          continue
        }
        
        // Calculate new value
        let newValue = 0
        const interestRate = parseFloat(debt.interest) || 0
        const principal = parseFloat(debt.total_amount) || 0
        
        if (interestRate > 0) {
          const startDate = new Date(debt.start_date + 'T12:00:00')
          if (!isNaN(startDate.getTime())) {
            const currentDate = new Date()
            const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
            
            if (daysSinceStart > 0) {
              const dailyInterestRate = interestRate / 100 / 365
              newValue = principal * dailyInterestRate * daysSinceStart
              
              // Cap at reasonable value
              if (newValue > principal * 5) {
                newValue = principal * 0.1
              }
            }
          }
        }
        
        // Round to 2 decimal places
        newValue = Math.round(newValue * 100) / 100
        
        // Update database
        await sql`
          UPDATE debts
          SET accumulated_interest = ${newValue},
              last_interest_calculation = ${new Date().toISOString().split('T')[0]}
          WHERE id = ${debtId}
            AND user_id = ${session.user?.id}
        `
        
        fixes.push({
          id: debtId,
          description: debt.description,
          old_value: currentValue,
          new_value: newValue,
          success: true
        })
        
        console.log(`   ✅ Debt ${debtId} fixed: ${currentValue} -> ${newValue}`)
        
      } catch (error) {
        errors.push({
          id: debt.id,
          description: debt.description,
          error: error instanceof Error ? error.message : String(error)
        })
        
        console.log(`   ❌ Error fixing debt ${debt.id}: ${error}`)
      }
    }
    
    return NextResponse.json({
      user: session.user?.name,
      summary: {
        processed: debts.length,
        fixed: fixes.length,
        errors: errors.length,
        skipped: debts.length - fixes.length - errors.length
      },
      fixes: fixes,
      errors: errors,
      timestamp: new Date().toISOString()
    }, { status: 200 })
    
  } catch (error) {
    console.error('❌ [DEBUG] Error in fix endpoint:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fix accumulated_interest',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
})