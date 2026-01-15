// TABLA DE CUENTAS
CREATE TABLE accounts (Id serial PRIMARY KEY, username varchar(100), name varchar(50), value NUMERIC(15, 2), type varchar(20));

// TABLA DE CATEGORIAS
CREATE TABLE categories (id serial PRIMARY KEY, name varchar(50));

// TABLA DE GASTOS
CREATE TABLE expenses (id SERIAL PRIMARY KEY, account_id INT REFERENCES accounts(Id), category_id INT REFERENCES categories(id), username VARCHAR(100), date_register DATE DEFAULT CURRENT_DATE, description VARCHAR(100), value NUMERIC(15, 2));

// TABLA DE DEUDAS
CREATE TABLE debts (id SERIAL PRIMARY KEY, username varchar(100), installments INT, description VARCHAR(50), interest NUMERIC(5, 2) DEFAULT 0, total_amount INT, pay_date INT, start_date DATE, accumulated_interest NUMERIC(15, 2) DEFAULT 0, last_interest_calculation DATE DEFAULT CURRENT_DATE);

// TABLA DE PAGOS
CREATE TABLE payments (id SERIAL PRIMARY KEY, debts_id INT REFERENCES debts(Id), payment_type VARCHAR(50), pay_value NUMERIC(15, 2), pay_day DATE DEFAULT CURRENT_DATE, capital_paid NUMERIC(15, 2) DEFAULT 0, interest_paid NUMERIC(15, 2) DEFAULT 0)

// TABLA DE INGRESOS
CREATE TABLE incomes (id SERIAL PRIMARY KEY, username varchar(100), type_income varchar(50), account_id INT REFERENCES accounts(Id),  value NUMERIC(15, 2), date varchar(20));

// TABLA DE EXCHANGE
CREATE TABLE exchanges (id SERIAL PRIMARY KEY, from_account_id INTEGER REFERENCES accounts(id),to_account_id INTEGER REFERENCES accounts(id), username VARCHAR(100), value INT, date DATE DEFAULT CURRENT_DATE);

// TABLE OF SAVING GOALS
CREATE TABLE saving_goals (id serial primary key, money_saved NUMERIC(15,2), goal NUMERIC(15,2), name_goal VARCHAR(50), username varchar(50));

// TABLE REGISTER OF SAVING GOALS
CREATE TABLE saving_goals_register (
    id SERIAL PRIMARY KEY,
    saving_goal_id INT REFERENCES saving_goals(Id),
    account_id INT REFERENCES accounts(Id),
    amount NUMERIC(15,2),
    date_register DATE DEFAULT CURRENT_DATE
);


CREATE TABLE user_currency_preferences (
    username VARCHAR(255) PRIMARY KEY,
    currency VARCHAR(3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
