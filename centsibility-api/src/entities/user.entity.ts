import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';
import { Transaction } from './transaction.entity';
import { Budget } from './budget.entity';
import { SavingsGoal } from './savings-goal.entity';
import { RecurringExpense } from './recurring-expense.entity';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'UserID' })
  userId: number;

  @Column({ name: 'FirstName', type: 'varchar', length: 50, nullable: false })
  firstName: string;

  @Column({ name: 'LastName', type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @Column({ name: 'Email', type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ name: 'PasswordHash', type: 'varchar', length: 255, nullable: false, select: false })
  passwordHash: string;

  @CreateDateColumn({ name: 'DateCreated', type: 'datetime' })
  dateCreated: Date;

  @OneToMany(() => Category, (c) => c.user)
  categories: Category[];

  @OneToMany(() => Transaction, (t) => t.user)
  transactions: Transaction[];

  @OneToMany(() => Budget, (b) => b.user)
  budgets: Budget[];

  @OneToMany(() => SavingsGoal, (g) => g.user)
  savingsGoals: SavingsGoal[];

  @OneToMany(() => RecurringExpense, (r) => r.user)
  recurringExpenses: RecurringExpense[];
}
