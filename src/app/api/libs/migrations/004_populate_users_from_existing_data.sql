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

-- Step 10: Add NOT NULL constraints after data migration is complete
-- (We'll do this in a separate migration to ensure data integrity)