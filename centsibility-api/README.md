# Centsibility API

Backend for Centsibility, an expense tracker and savings goal app (ITEC 116).

**Stack:** NestJS, TypeORM, MySQL, JWT, Postman, Git & GitHub

## Setup
1. Install Node.js and MySQL.
2. Run `database/schema.sql` in MySQL (phpMyAdmin Import, or `mysql -u root -p < database/schema.sql`). It creates the `centsibility` database and all tables.
3. Copy `.env.example` to `.env` and fill in your MySQL password and JWT secret. Keep `DB_SYNC=false` when using the SQL script.
4. `npm install`
5. `npm run start:dev`
6. Optional: register `demo@centsibility.com` through the API, then run `database/sample-data.sql`.

The API runs at `http://localhost:3000/api/v1`