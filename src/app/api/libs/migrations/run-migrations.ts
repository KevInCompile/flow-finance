import { sql } from '@vercel/postgres'
import fs from 'fs'
import path from 'path'

async function runMigrations() {
  console.log('🔧 Iniciando ejecución de migraciones...')
  
  // Crear tabla de control de migraciones si no existe
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✅ Tabla de migraciones verificada/creada')
  } catch (error) {
    console.error('❌ Error creando tabla de migraciones:', error)
    return
  }

  // Obtener migraciones ya aplicadas
  let appliedMigrations: string[] = []
  try {
    const result = await sql`SELECT migration_name FROM migrations ORDER BY id ASC`
    appliedMigrations = result.rows.map(row => row.migration_name)
    console.log(`📋 Migraciones aplicadas: ${appliedMigrations.length}`)
  } catch (error) {
    console.error('❌ Error obteniendo migraciones aplicadas:', error)
    return
  }

  // Leer archivos de migración
  const migrationsDir = path.join(process.cwd(), 'src/app/api/libs/migrations')
  let migrationFiles: string[] = []
  
  try {
    migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort() // Ordenar alfabéticamente para aplicar en orden
    console.log(`📁 Encontradas ${migrationFiles.length} migraciones en el directorio`)
  } catch (error) {
    console.error('❌ Error leyendo directorio de migraciones:', error)
    return
  }

  // Aplicar migraciones pendientes
  let appliedCount = 0
  for (const migrationFile of migrationFiles) {
    if (appliedMigrations.includes(migrationFile)) {
      console.log(`⏭️  Migración ya aplicada: ${migrationFile}`)
      continue
    }

    console.log(`🚀 Aplicando migración: ${migrationFile}`)
    
    try {
      // Leer contenido del archivo SQL
      const migrationPath = path.join(migrationsDir, migrationFile)
      const sqlContent = fs.readFileSync(migrationPath, 'utf8')
      
      // Separar las sentencias SQL (asumiendo que están separadas por punto y coma)
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0)
      
      // Ejecutar cada sentencia
      for (const statement of statements) {
        if (statement.startsWith('--')) continue // Saltar comentarios
        await sql.query(statement + ';')
      }
      
      // Registrar migración como aplicada
      await sql`INSERT INTO migrations (migration_name) VALUES (${migrationFile})`
      
      console.log(`✅ Migración aplicada exitosamente: ${migrationFile}`)
      appliedCount++
      
    } catch (error) {
      console.error(`❌ Error aplicando migración ${migrationFile}:`, error)
      console.log('⚠️  Deteniendo ejecución de migraciones debido a error')
      return
    }
  }

  if (appliedCount === 0) {
    console.log('🎉 No hay migraciones pendientes. La base de datos está actualizada.')
  } else {
    console.log(`🎉 Migraciones completadas: ${appliedCount} migración(es) aplicada(s)`)
  }
}

// Ejecutar migraciones si este script se ejecuta directamente
if (require.main === module) {
  runMigrations().catch(error => {
    console.error('💥 Error fatal ejecutando migraciones:', error)
    process.exit(1)
  })
}

export { runMigrations }