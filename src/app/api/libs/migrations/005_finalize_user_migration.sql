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
ALTER TABLE accounts DROP COLUMN username;
ALTER TABLE categories DROP COLUMN username;
ALTER TABLE expenses DROP COLUMN username;
ALTER TABLE debts DROP COLUMN username;
ALTER TABLE incomes DROP COLUMN username;
ALTER TABLE exchanges DROP COLUMN username;
ALTER TABLE saving_goals DROP COLUMN username;
ALTER TABLE user_currency_preferences DROP COLUMN username;

-- Step 3: Update primary key constraint for user_currency_preferences
ALTER TABLE user_currency_preferences DROP CONSTRAINT user_currency_preferences_pkey;
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

-- Step 5: Create a view for backward compatibility if needed (optional)
-- This view can be used by old code during transition period
CREATE OR REPLACE VIEW vw_accounts_with_username AS
SELECT a.*, u.username, u.email
FROM accounts a
JOIN users u ON a.user_id = u.id;

-- Step 6: Verify migration by checking for any orphaned records
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