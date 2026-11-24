-- ============================================================
-- OPTIONAL sample data for testing and the demo video.
--
-- BEFORE running this file, register the demo user through the API
-- (so the password is hashed properly by bcrypt):
--
--   POST http://localhost:3000/api/v1/users
--   {
--     "firstName": "Demo",
--     "lastName": "User",
--     "email": "demo@centsibility.com",
--     "password": "Demo1234"
--   }
-- ============================================================

USE centsibility;

SET @uid = (SELECT UserID FROM Users WHERE Email = 'demo@centsibility.com');

-- Categories
INSERT INTO Categories (UserID, CategoryName, CategoryType) VALUES
  (@uid, 'Food',          'Expense'),
  (@uid, 'Transportation','Expense'),
  (@uid, 'Subscriptions', 'Expense'),
  (@uid, 'Bills',         'Expense'),
  (@uid, 'Allowance',     'Income');

SET @food  = (SELECT CategoryID FROM Categories WHERE UserID = @uid AND CategoryName = 'Food');
SET @trans = (SELECT CategoryID FROM Categories WHERE UserID = @uid AND CategoryName = 'Transportation');
SET @subs  = (SELECT CategoryID FROM Categories WHERE UserID = @uid AND CategoryName = 'Subscriptions');
SET @bills = (SELECT CategoryID FROM Categories WHERE UserID = @uid AND CategoryName = 'Bills');
SET @allow = (SELECT CategoryID FROM Categories WHERE UserID = @uid AND CategoryName = 'Allowance');

-- Transactions
INSERT INTO Transactions (UserID, CategoryID, Amount, TransactionDate, Description, ReceiptImagePath) VALUES
  (@uid, @allow, 5000.00, '2026-11-01', 'Monthly allowance', NULL),
  (@uid, @food,   150.00, '2026-11-18', 'Lunch',             NULL),
  (@uid, @food,    85.50, '2026-11-20', 'Milk tea',          'receipts/milk-tea.jpg'),
  (@uid, @trans,   60.00, '2026-11-21', 'Jeepney and tricycle fare', NULL),
  (@uid, @bills, 1200.00, '2026-11-15', 'Electricity bill',  NULL);

-- Budgets (November 2026)
INSERT INTO Budgets (UserID, CategoryID, MonthlyLimit, BudgetMonth, AlertThreshold) VALUES
  (@uid, @food,  3000.00, '2026-11-01', 80),
  (@uid, @trans, 1000.00, '2026-11-01', 80);

-- Savings goals
INSERT INTO SavingsGoals (UserID, GoalName, TargetAmount, CurrentAmount, TargetDate, Status) VALUES
  (@uid, 'Emergency Fund', 10000.00, 2500.00, '2027-03-31', 'Active'),
  (@uid, 'Travel',          5000.00,  500.00, NULL,         'Active');

-- Recurring expenses
INSERT INTO RecurringExpenses (UserID, CategoryID, Description, Amount, Frequency, NextDueDate, ReminderDaysBefore) VALUES
  (@uid, @subs,  'Netflix',     249.00, 'Monthly', '2026-12-05', 3),
  (@uid, @bills, 'Electricity', 1200.00,'Monthly', '2026-12-15', 3);
