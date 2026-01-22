-- Migration Runner Script
-- Run these migrations in order to implement the new users table system

-- IMPORTANT: Run these migrations in order:
-- 1. 003_create_users_table.sql
-- 2. 004_populate_users_from_existing_data.sql
-- 3. 005_finalize_user_migration.sql

-- Migration 003: Create users table and update foreign key references
-- This migration adds a proper users table with UUID primary key
-- and updates existing tables to reference user_id instead of username

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Add user_id column to accounts table
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Add user_id column to categories table  
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Add user_id column to expenses table
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Add user_id column to debts table
ALTER TABLE debts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Add user_id column to incomes table
ALTER TABLE incomes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Add user_id column to exchanges table
ALTER TABLE exchanges ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Add user_id column to saving_goals table
ALTER TABLE saving_goals ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Add user_id column to user_currency_preferences table
ALTER TABLE user_currency_preferences ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create indexes on user_id columns for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_debts_user_id ON debts(user_id);
CREATE INDEX IF NOT EXISTS idx_incomes_user_id ON incomes(user_id);
CREATE INDEX IF NOT EXISTS idx_exchanges_user_id ON exchanges(user_id);
CREATE INDEX IF NOT EXISTS idx_saving_goals_user_id ON saving_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_currency_preferences_user_id ON user_currency_preferences(user_id);

-- Migration 004: Populate users table from existing data and update foreign keys
-- This migration creates user records from existing username data and updates all tables

-- Step 1: Create users from unique usernames in the system
INSERT INTO users (email, username)
SELECT 
  -- Create a unique email for each username (temporary, will be updated on first login)
  CONCAT(username, '@temp.migration.com') as email,
  username
FROM (
  -- Get unique usernames from all tables
  SELECT DISTINCT username FROM accounts WHERE username IS NOT NULL
  UNION
  SELECT DISTINCT username FROM categories WHERE username IS NOT NULL
  UNION
  SELECT DISTINCT username FROM expenses WHERE username IS NOT NULL
  UNION
  SELECT DISTINCT username FROM debts WHERE username IS NOT NULL
  UNION
  SELECT DISTINCT username FROM incomes WHERE username IS NOT NULL
  UNION
  SELECT DISTINCT username FROM exchanges WHERE username IS NOT NULL
  UNION
  SELECT DISTINCT username FROM saving_goals WHERE username IS NOT NULL
  UNION
  SELECT DISTINCT username FROM user_currency_preferences WHERE username IS NOT NULL
) AS all_usernames
WHERE username NOT IN (SELECT username FROM users);

-- Step 2: Update accounts table with user_id
UPDATE accounts a
SET user_id = u.id
FROM users u
WHERE a.username = u.username AND a.user_id IS NULL;

-- Step 3: Update categories table with user_id
UPDATE categories c
SET user_id = u.id
FROM users u
WHERE c.username = u.username AND c.user_id IS NULL;

-- Step 4: Update expenses table with user_id
UPDATE expenses e
SET user_id = u.id
FROM users u
WHERE e.username = u.username AND e.user_id IS NULL;

-- Step 5: Update debts table with user_id
UPDATE debts d
SET user_id = u.id
FROM users u
WHERE d.username = u.username AND d.user_id IS NULL;

-- Step 6: Update incomes table with user_id
UPDATE incomes i
SET user_id = u.id
FROM users u
WHERE i.username = u.username AND i.user_id IS NULL;

-- Step 7: Update exchanges table with user_id
UPDATE exchanges e
SET user_id = u.id
FROM users u
WHERE e.username = u.username AND e.user_id IS NULL;

-- Step 8: Update saving_goals table with user_id
UPDATE saving_goals sg
SET user_id = u.id
FROM users u
WHERE sg.username = u.username AND sg.user_id IS NULL;

-- Step 9: Update user_currency_preferences table with user_id
UPDATE user_currency_preferences ucp
SET user_id = u.id
FROM users u
WHERE ucp.username = u.username AND ucp.user_id IS NULL;

-- Migration 005: Finalize user migration - Add NOT NULL constraints and drop old username columns
-- This migration should be run after all data has been migrated and verified

-- Step 1: Add NOT NULL constraints to user_id columns
ALTER TABLE accounts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE categories ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE expenses ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE debts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE incomes ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE exchanges ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE saving_goals ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_currency_preferences ALTER COLUMN user_id SET NOT NULL;

-- Step 2: Drop old username columns (after verifying all data has been migrated)
ALTER TABLE accounts DROP COLUMN IF EXISTS username;
ALTER TABLE categories DROP COLUMN IF EXISTS username;
ALTER TABLE expenses DROP COLUMN IF EXISTS username;
ALTER TABLE debts DROP COLUMN IF EXISTS username;
ALTER TABLE incomes DROP COLUMN IF EXISTS username;
ALTER TABLE exchanges DROP COLUMN IF EXISTS username;
ALTER TABLE saving_goals DROP COLUMN IF EXISTS username;
ALTER TABLE user_currency_preferences DROP COLUMN IF EXISTS username;

-- Step 3: Update primary key constraint for user_currency_preferences
ALTER TABLE user_currency_preferences DROP CONSTRAINT IF EXISTS user_currency_preferences_pkey;
ALTER TABLE user_currency_preferences ADD PRIMARY KEY (user_id);

-- Step 4: Add foreign key constraints if not already present (for safety)
ALTER TABLE accounts ADD CONSTRAINT fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE categories ADD CONSTRAINT fk_categories_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE expenses ADD CONSTRAINT fk_expenses_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE debts ADD CONSTRAINT fk_debts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE incomes ADD CONSTRAINT fk_incomes_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE exchanges ADD CONSTRAINT fk_exchanges_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE saving_goals ADD CONSTRAINT fk_saving_goals_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_currency_preferences ADD CONSTRAINT fk_user_currency_preferences_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Step 5: Verify migration by checking for any orphaned records
-- This query should return 0 rows if migration was successful
SELECT 'accounts' as table_name, COUNT(*) as orphaned_records FROM accounts WHERE user_id NOT IN (SELECT id FROM users)
UNION ALL
SELECT 'categories', COUNT(*) FROM categories WHERE user_id NOT IN (SELECT id FROM users)
UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses WHERE user_id NOT IN (SELECT id FROM users)
UNION ALL
SELECT 'debts', COUNT(*) FROM debts WHERE user_id NOT IN (SELECT id FROM users)
UNION ALL
SELECT 'incomes', COUNT(*) FROM incomes WHERE user_id NOT IN (SELECT id FROM users)
UNION ALL
SELECT 'exchanges', COUNT(*) FROM exchanges WHERE user_id NOT IN (SELECT id FROM users)
UNION ALL
SELECT 'saving_goals', COUNT(*) FROM saving_goals WHERE user_id NOT IN (SELECT id FROM users)
UNION ALL
SELECT 'user_currency_preferences', COUNT(*) FROM user_currency_preferences WHERE user_id NOT IN (SELECT id FROM users);

-- Display migration completion message
SELECT '✅ Migration completed successfully!' as migration_status;