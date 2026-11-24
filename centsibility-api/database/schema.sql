-- ============================================================
-- Centsibility Database Schema (MySQL 8.0.16+ / MariaDB 10.2+)
-- Matches the Lab 04 Data Dictionary and the TypeORM entities.
-- ============================================================

CREATE DATABASE IF NOT EXISTS centsibility
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE centsibility;

-- Drop in child-to-parent order so the script can be re-run
DROP TABLE IF EXISTS RecurringExpenses;
DROP TABLE IF EXISTS SavingsGoals;
DROP TABLE IF EXISTS Budgets;
DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Users;

-- ------------------------------------------------------------
-- Users: account details of each person using Centsibility
-- ------------------------------------------------------------
CREATE TABLE Users (
  UserID        INT           NOT NULL AUTO_INCREMENT,
  FirstName     VARCHAR(50)   NOT NULL,
  LastName      VARCHAR(50)   NOT NULL,
  Email         VARCHAR(100)  NOT NULL,
  PasswordHash  VARCHAR(255)  NOT NULL,
  DateCreated   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT PK_Users PRIMARY KEY (UserID),
  CONSTRAINT UQ_Users_Email UNIQUE (Email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Categories: income and expense categories of a user
-- ------------------------------------------------------------
CREATE TABLE Categories (
  CategoryID    INT           NOT NULL AUTO_INCREMENT,
  UserID        INT           NOT NULL,
  CategoryName  VARCHAR(50)   NOT NULL,
  CategoryType  VARCHAR(10)   NOT NULL,
  CONSTRAINT PK_Categories PRIMARY KEY (CategoryID),
  CONSTRAINT FK_Categories_Users FOREIGN KEY (UserID)
    REFERENCES Users (UserID) ON DELETE CASCADE,
  CONSTRAINT CK_Categories_Type CHECK (CategoryType IN ('Income','Expense'))
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Transactions: every income or expense entry
-- ------------------------------------------------------------
CREATE TABLE Transactions (
  TransactionID     INT            NOT NULL AUTO_INCREMENT,
  UserID            INT            NOT NULL,
  CategoryID        INT            NOT NULL,
  Amount            DECIMAL(10,2)  NOT NULL,
  TransactionDate   DATE           NOT NULL,
  Description       VARCHAR(255)   NULL,
  ReceiptImagePath  VARCHAR(255)   NULL,
  CONSTRAINT PK_Transactions PRIMARY KEY (TransactionID),
  CONSTRAINT FK_Transactions_Users FOREIGN KEY (UserID)
    REFERENCES Users (UserID) ON DELETE CASCADE,
  -- RESTRICT: a category that still has transactions cannot be deleted (API returns 409)
  CONSTRAINT FK_Transactions_Categories FOREIGN KEY (CategoryID)
    REFERENCES Categories (CategoryID) ON DELETE RESTRICT,
  CONSTRAINT CK_Transactions_Amount CHECK (Amount > 0),
  INDEX IX_Transactions_User_Date (UserID, TransactionDate)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Budgets: monthly spending limit per category
-- ------------------------------------------------------------
CREATE TABLE Budgets (
  BudgetID        INT            NOT NULL AUTO_INCREMENT,
  UserID          INT            NOT NULL,
  CategoryID      INT            NOT NULL,
  MonthlyLimit    DECIMAL(10,2)  NOT NULL,
  BudgetMonth     DATE           NOT NULL,
  AlertThreshold  INT            NOT NULL DEFAULT 80,
  CONSTRAINT PK_Budgets PRIMARY KEY (BudgetID),
  CONSTRAINT FK_Budgets_Users FOREIGN KEY (UserID)
    REFERENCES Users (UserID) ON DELETE CASCADE,
  CONSTRAINT FK_Budgets_Categories FOREIGN KEY (CategoryID)
    REFERENCES Categories (CategoryID) ON DELETE CASCADE,
  -- one budget per category per month (API returns 409 if it already exists)
  CONSTRAINT UQ_Budgets_User_Category_Month UNIQUE (UserID, CategoryID, BudgetMonth),
  CONSTRAINT CK_Budgets_Limit CHECK (MonthlyLimit > 0),
  CONSTRAINT CK_Budgets_Threshold CHECK (AlertThreshold BETWEEN 1 AND 100)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SavingsGoals: savings targets with progress tracking
-- ------------------------------------------------------------
CREATE TABLE SavingsGoals (
  GoalID         INT            NOT NULL AUTO_INCREMENT,
  UserID         INT            NOT NULL,
  GoalName       VARCHAR(100)   NOT NULL,
  TargetAmount   DECIMAL(10,2)  NOT NULL,
  CurrentAmount  DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  TargetDate     DATE           NULL,
  Status         VARCHAR(15)    NOT NULL DEFAULT 'Active',
  CONSTRAINT PK_SavingsGoals PRIMARY KEY (GoalID),
  CONSTRAINT FK_SavingsGoals_Users FOREIGN KEY (UserID)
    REFERENCES Users (UserID) ON DELETE CASCADE,
  CONSTRAINT CK_SavingsGoals_Target CHECK (TargetAmount > 0),
  CONSTRAINT CK_SavingsGoals_Current CHECK (CurrentAmount >= 0),
  CONSTRAINT CK_SavingsGoals_Status CHECK (Status IN ('Active','Completed','Cancelled'))
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- RecurringExpenses: bills and subscriptions used for reminders
-- ------------------------------------------------------------
CREATE TABLE RecurringExpenses (
  RecurringID         INT            NOT NULL AUTO_INCREMENT,
  UserID              INT            NOT NULL,
  CategoryID          INT            NOT NULL,
  Description         VARCHAR(100)   NOT NULL,
  Amount              DECIMAL(10,2)  NOT NULL,
  Frequency           VARCHAR(10)    NOT NULL,
  NextDueDate         DATE           NOT NULL,
  ReminderDaysBefore  INT            NOT NULL DEFAULT 3,
  CONSTRAINT PK_RecurringExpenses PRIMARY KEY (RecurringID),
  CONSTRAINT FK_Recurring_Users FOREIGN KEY (UserID)
    REFERENCES Users (UserID) ON DELETE CASCADE,
  CONSTRAINT FK_Recurring_Categories FOREIGN KEY (CategoryID)
    REFERENCES Categories (CategoryID) ON DELETE CASCADE,
  CONSTRAINT CK_Recurring_Amount CHECK (Amount > 0),
  CONSTRAINT CK_Recurring_Frequency CHECK (Frequency IN ('Weekly','Monthly','Yearly'))
) ENGINE=InnoDB;
