-- Migration 003: Create users table and update foreign key references
-- This migration adds a proper users table with UUID primary key
-- and updates existing tables to reference user_id instead of username

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Add user_id column to accounts table
ALTER TABLE accounts ADD COLUMN user_id UUID REFERENCES users(id);

-- Add user_id column to categories table  
ALTER TABLE categories ADD COLUMN user_id UUID REFERENCES users(id);

-- Add user_id column to expenses table
ALTER TABLE expenses ADD COLUMN user_id UUID REFERENCES users(id);

-- Add user_id column to debts table
ALTER TABLE debts ADD COLUMN user_id UUID REFERENCES users(id);

-- Add user_id column to incomes table
ALTER TABLE incomes ADD COLUMN user_id UUID REFERENCES users(id);

-- Add user_id column to exchanges table
ALTER TABLE exchanges ADD COLUMN user_id UUID REFERENCES users(id);

-- Add user_id column to saving_goals table
ALTER TABLE saving_goals ADD COLUMN user_id UUID REFERENCES users(id);

-- Add user_id column to user_currency_preferences table
ALTER TABLE user_currency_preferences ADD COLUMN user_id UUID REFERENCES users(id);

-- Create index on username for faster lookups
CREATE INDEX idx_users_username ON users(username);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create indexes on user_id columns for better performance
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_debts_user_id ON debts(user_id);
CREATE INDEX idx_incomes_user_id ON incomes(user_id);
CREATE INDEX idx_exchanges_user_id ON exchanges(user_id);
CREATE INDEX idx_saving_goals_user_id ON saving_goals(user_id);
CREATE INDEX idx_user_currency_preferences_user_id ON user_currency_preferences(user_id);