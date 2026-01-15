-- Migration 002: Add capital_paid and interest_paid columns to payments table
-- This migration adds detailed breakdown of payments into capital and interest components

-- Add new columns to payments table
ALTER TABLE payments 
ADD COLUMN capital_paid NUMERIC(15, 2) DEFAULT 0,
ADD COLUMN interest_paid NUMERIC(15, 2) DEFAULT 0;

-- Update existing payments to calculate capital and interest based on amortization
-- For existing payments, we'll need to calculate the breakdown
-- This is a placeholder comment - actual data migration would require complex logic
-- based on the debt's amortization schedule at the time of payment

-- Add comment explaining the new columns
COMMENT ON COLUMN payments.capital_paid IS 'Amount of principal/capital paid in this payment';
COMMENT ON COLUMN payments.interest_paid IS 'Amount of interest paid in this payment';

-- Note: The sum of capital_paid + interest_paid should equal pay_value
-- We'll add a check constraint to ensure data integrity
ALTER TABLE payments 
ADD CONSTRAINT payments_value_check 
CHECK (pay_value = capital_paid + interest_paid OR (capital_paid IS NULL AND interest_paid IS NULL));