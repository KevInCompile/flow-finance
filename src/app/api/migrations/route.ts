import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'src/app/api/libs/migrations/run-migrations.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0)
    
    const results = []
    
    // Execute each statement
    for (const statement of statements) {
      try {
        // Skip SELECT statements that are for verification only
        if (statement.toUpperCase().startsWith('SELECT')) {
          const result = await sql`${statement}`
          results.push({
            statement: statement.substring(0, 100) + '...',
            result: result.rows
          })
        } else {
          await sql`${statement}`
          results.push({
            statement: statement.substring(0, 100) + '...',
            status: 'success'
          })
        }
      } catch (error: any) {
        results.push({
          statement: statement.substring(0, 100) + '...',
          status: 'error',
          error: error.message
        })
      }
    }
    
    return NextResponse.json({
      message: 'Migrations executed',
      total_statements: statements.length,
      results
    }, { status: 200 })
    
  } catch (error: any) {
    return NextResponse.json({
      error: 'Migration failed',
      details: error.message
    }, { status: 500 })
  }
}