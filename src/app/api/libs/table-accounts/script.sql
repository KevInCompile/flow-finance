// TABLA DE CUENTAS
CREATE TABLE accounts (Id serial PRIMARY KEY, Username varchar(100), Name varchar(50), Value int, Type varchar(20));

// TABLA DE CATEGORIAS
CREATE TABLE categories (Id serial PRIMARY KEY, Name varchar(50));

// TABLA DE GASTOS
CREATE TABLE expenses (Id SERIAL PRIMARY KEY, AccountId INT REFERENCES accounts(Id), CategoryId INT REFERENCES categories(Id), Username VARCHAR(100), DateRegister DATE DEFAULT CURRENT_DATE, Description VARCHAR(100), Value INT);

// TABLA DE DEUDAS
CREATE TABLE debts (Id SERIAL PRIMARY KEY, Username varchar(100), Fee INT, Description VARCHAR(50), Paid INT DEFAULT 0, TotalDue INT, Payday INT, FeeValue INT);

// TABLA DE PAGOS
CREATE TABLE payments (Id SERIAL PRIMARY KEY, DebtsId INT REFERENCES debts(Id), PaymentType VARCHAR(50), PayValue INT,  Payday DATE DEFAULT CURRENT_DATE)

// TABLA DE INGRESOS
CREATE TABLE incomes (Id SERIAL PRIMARY KEY, Username varchar(100), TypeIncome varchar(50), AccountId INT REFERENCES accounts(Id), Value int, date varchar(20));

// TABLA DE EXCHANGE
CREATE TABLE exchanges (Id SERIAL PRIMARY KEY,FromAccountId INTEGER REFERENCES accounts(Id),ToAccountId INTEGER REFERENCES accounts(Id),Username VARCHAR(255), Value INT,Date DATE DEFAULT CURRENT_DATE);
