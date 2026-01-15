-- Migración 001: Agregar campos de interés acumulado a la tabla debts
-- Esta migración agrega los campos necesarios para calcular intereses diarios

-- Agregar columna accumulated_interest para almacenar el interés acumulado
ALTER TABLE debts 
ADD COLUMN IF NOT EXISTS accumulated_interest NUMERIC(15, 2) DEFAULT 0;

-- Agregar columna last_interest_calculation para almacenar la última fecha de cálculo de interés
ALTER TABLE debts 
ADD COLUMN IF NOT EXISTS last_interest_calculation DATE DEFAULT CURRENT_DATE;

-- Actualizar las deudas existentes para que tengan una fecha de último cálculo
-- Si no tienen start_date, usar la fecha actual
UPDATE debts 
SET last_interest_calculation = COALESCE(start_date, CURRENT_DATE)
WHERE last_interest_calculation IS NULL;

-- Comentario: El campo interest ya existe en la tabla (INT DEFAULT 0)
-- Este campo almacena la tasa de interés anual en porcentaje (ej: 15 para 15%)
-- Se cambia el tipo de dato para aceptar valores decimales
ALTER TABLE debts 
ALTER COLUMN interest TYPE NUMERIC(5, 2);

-- Actualizar las deudas existentes para mantener compatibilidad
UPDATE debts 
SET interest = interest::NUMERIC(5, 2)
WHERE interest IS NOT NULL;