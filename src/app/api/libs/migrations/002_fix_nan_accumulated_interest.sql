-- Migración 002: Corregir valores NaN en accumulated_interest
-- Esta migración corrige cualquier valor NaN, NULL o inválido en la columna accumulated_interest

-- 1. Primero, verificar si hay valores problemáticos
DO $$
DECLARE
    nan_count INTEGER;
    null_count INTEGER;
    empty_count INTEGER;
    negative_count INTEGER;
    total_problems INTEGER;
BEGIN
    -- Contar valores problemáticos
    SELECT COUNT(*) INTO nan_count FROM debts WHERE accumulated_interest = 'NaN' OR accumulated_interest::text LIKE '%NaN%';
    SELECT COUNT(*) INTO null_count FROM debts WHERE accumulated_interest IS NULL;
    SELECT COUNT(*) INTO empty_count FROM debts WHERE accumulated_interest = '';
    SELECT COUNT(*) INTO negative_count FROM debts WHERE accumulated_interest < 0;
    
    total_problems := nan_count + null_count + empty_count + negative_count;
    
    -- Registrar en logs
    RAISE NOTICE 'Migración 002: Encontrados % valores problemáticos en accumulated_interest', total_problems;
    RAISE NOTICE '  - Valores "NaN": %', nan_count;
    RAISE NOTICE '  - Valores NULL: %', null_count;
    RAISE NOTICE '  - Valores vacíos: %', empty_count;
    RAISE NOTICE '  - Valores negativos: %', negative_count;
END $$;

-- 2. Corregir valores NULL y vacíos estableciéndolos en 0
UPDATE debts 
SET accumulated_interest = 0,
    last_interest_calculation = COALESCE(last_interest_calculation, CURRENT_DATE)
WHERE accumulated_interest IS NULL 
   OR accumulated_interest = '';

-- 3. Corregir valores "NaN" (string) estableciéndolos en 0
UPDATE debts 
SET accumulated_interest = 0,
    last_interest_calculation = COALESCE(last_interest_calculation, CURRENT_DATE)
WHERE accumulated_interest = 'NaN' 
   OR accumulated_interest::text LIKE '%NaN%';

-- 4. Corregir valores negativos estableciéndolos en 0
UPDATE debts 
SET accumulated_interest = 0,
    last_interest_calculation = COALESCE(last_interest_calculation, CURRENT_DATE)
WHERE accumulated_interest < 0;

-- 5. Para deudas con interés > 0, recalcular accumulated_interest basado en días desde start_date
--    Esto es opcional pero recomendado para tener valores más precisos
DO $$
DECLARE
    rec RECORD;
    days_since_start INTEGER;
    daily_interest_rate NUMERIC;
    calculated_interest NUMERIC;
    recalculated_count INTEGER := 0;
BEGIN
    FOR rec IN 
        SELECT d.id, d.interest, d.total_amount, d.accumulated_interest, d.start_date
        FROM debts d
        WHERE d.interest > 0 
          AND d.total_amount > 0
          AND d.start_date IS NOT NULL
          AND d.accumulated_interest = 0  -- Solo recalcular si está en 0 (recién corregido)
    LOOP
        -- Calcular días desde start_date
        days_since_start := GREATEST(0, DATE_PART('day', CURRENT_DATE - rec.start_date::date)::INTEGER);
        
        IF days_since_start > 0 THEN
            -- Calcular interés diario
            daily_interest_rate := (rec.interest::NUMERIC / 100) / 365;
            calculated_interest := rec.total_amount::NUMERIC * daily_interest_rate * days_since_start;
            
            -- Redondear a 2 decimales y asegurar valor razonable
            calculated_interest := ROUND(calculated_interest, 2);
            
            -- Limitar a un máximo del 50% del principal (evitar valores irrealmente altos)
            IF calculated_interest > (rec.total_amount::NUMERIC * 0.5) THEN
                calculated_interest := rec.total_amount::NUMERIC * 0.1; -- 10% como valor razonable
            END IF;
            
            -- Actualizar solo si el cálculo es válido
            IF calculated_interest > 0 THEN
                UPDATE debts 
                SET accumulated_interest = calculated_interest,
                    last_interest_calculation = CURRENT_DATE
                WHERE id = rec.id;
                
                recalculated_count := recalculated_count + 1;
            END IF;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Migración 002: Recalculados % deudas con interés positivo', recalculated_count;
END $$;

-- 6. Verificar que todos los valores sean numéricos válidos
DO $$
DECLARE
    invalid_count INTEGER;
    valid_count INTEGER;
    total_count INTEGER;
BEGIN
    -- Contar valores que no pueden convertirse a número
    SELECT COUNT(*) INTO invalid_count 
    FROM debts 
    WHERE accumulated_interest IS NOT NULL 
      AND accumulated_interest != ''
      AND accumulated_interest !~ '^-?[0-9]+(\.[0-9]+)?$';
    
    -- Contar total de deudas
    SELECT COUNT(*) INTO total_count FROM debts;
    
    -- Contar valores válidos
    valid_count := total_count - invalid_count;
    
    RAISE NOTICE 'Migración 002: Verificación final';
    RAISE NOTICE '  - Total de deudas: %', total_count;
    RAISE NOTICE '  - Valores válidos: %', valid_count;
    RAISE NOTICE '  - Valores inválidos: %', invalid_count;
    
    IF invalid_count > 0 THEN
        RAISE WARNING 'Migración 002: Aún hay % valores inválidos en accumulated_interest', invalid_count;
        
        -- Forzar los valores inválidos restantes a 0
        UPDATE debts 
        SET accumulated_interest = 0,
            last_interest_calculation = COALESCE(last_interest_calculation, CURRENT_DATE)
        WHERE accumulated_interest IS NOT NULL 
          AND accumulated_interest != ''
          AND accumulated_interest !~ '^-?[0-9]+(\.[0-9]+)?$';
          
        RAISE NOTICE 'Migración 002: Valores inválidos restantes forzados a 0';
    END IF;
END $$;

-- 7. Agregar restricción CHECK para prevenir valores inválidos en el futuro
--    Nota: Esto solo se agrega si no existe ya
DO $$
BEGIN
    -- Verificar si la restricción ya existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'accumulated_interest_numeric_check' 
          AND table_name = 'debts'
    ) THEN
        -- Agregar restricción CHECK para asegurar que accumulated_interest sea numérico y no negativo
        ALTER TABLE debts 
        ADD CONSTRAINT accumulated_interest_numeric_check 
        CHECK (
            accumulated_interest IS NULL OR 
            (
                accumulated_interest::text ~ '^-?[0-9]+(\.[0-9]+)?$' AND
                accumulated_interest >= 0
            )
        );
        
        RAISE NOTICE 'Migración 002: Restricción CHECK agregada a accumulated_interest';
    ELSE
        RAISE NOTICE 'Migración 002: La restricción CHECK ya existe, omitiendo...';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Migración 002: No se pudo agregar restricción CHECK (puede que ya exista o haya conflicto): %', SQLERRM;
END $$;

-- 8. Verificación final
DO $$
DECLARE
    final_nan_count INTEGER;
    final_null_count INTEGER;
    final_empty_count INTEGER;
    final_negative_count INTEGER;
    final_total_problems INTEGER;
BEGIN
    -- Contar valores problemáticos después de la migración
    SELECT COUNT(*) INTO final_nan_count FROM debts WHERE accumulated_interest = 'NaN' OR accumulated_interest::text LIKE '%NaN%';
    SELECT COUNT(*) INTO final_null_count FROM debts WHERE accumulated_interest IS NULL;
    SELECT COUNT(*) INTO final_empty_count FROM debts WHERE accumulated_interest = '';
    SELECT COUNT(*) INTO final_negative_count FROM debts WHERE accumulated_interest < 0;
    
    final_total_problems := final_nan_count + final_null_count + final_empty_count + final_negative_count;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migración 002: RESUMEN FINAL';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Valores problemáticos después de la migración: %', final_total_problems;
    
    IF final_total_problems = 0 THEN
        RAISE NOTICE '✅ ¡Migración exitosa! Todos los valores de accumulated_interest son válidos.';
    ELSE
        RAISE WARNING '⚠️  Migración incompleta: Aún hay % valores problemáticos', final_total_problems;
        RAISE NOTICE '  - Valores "NaN": %', final_nan_count;
        RAISE NOTICE '  - Valores NULL: %', final_null_count;
        RAISE NOTICE '  - Valores vacíos: %', final_empty_count;
        RAISE NOTICE '  - Valores negativos: %', final_negative_count;
    END IF;
    
    -- Mostrar estadísticas generales
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Estadísticas de accumulated_interest:';
    RAISE NOTICE '  - Mínimo: %', (SELECT MIN(accumulated_interest) FROM debts WHERE accumulated_interest IS NOT NULL);
    RAISE NOTICE '  - Máximo: %', (SELECT MAX(accumulated_interest) FROM debts WHERE accumulated_interest IS NOT NULL);
    RAISE NOTICE '  - Promedio: %', (SELECT AVG(accumulated_interest) FROM debts WHERE accumulated_interest IS NOT NULL);
    RAISE NOTICE '  - Total con valor 0: %', (SELECT COUNT(*) FROM debts WHERE accumulated_interest = 0);
    RAISE NOTICE '========================================';
END $$;

-- 9. Comentario para documentación
COMMENT ON COLUMN debts.accumulated_interest IS 'Interés acumulado calculado. Debe ser un número no negativo. Valores inválidos se corrigen automáticamente a 0.';