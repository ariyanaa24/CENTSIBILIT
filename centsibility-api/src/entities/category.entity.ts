import { Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { Budget } from './budget.entity';
import { RecurringExpense } from './recurring-expense.entity';

@Entity({ name: 'Categories' })
@Check(`\`CategoryType\` IN ('Income','Expense')`)
export class Category {
  @PrimaryGeneratedColumn({ name: 'CategoryID' })
  categoryId: number;

  @Column({ name: 'UserID', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'CategoryName', type: 'varchar', length: 50, nullable: false })
  categoryName: string;

  @Column({ name: 'CategoryType', type: 'varchar', length: 10, nullable: false })
  categoryType: 'Income' | 'Expense';

  @ManyToOne(() => User, (u) => u.categories, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserID' })
  user: User;

  @OneToMany(() => Transaction, (t) => t.category)
  transactions: Transaction[];

  @OneToMany(() => Budget, (b) => b.category)
  budgets: Budget[];

  @OneToMany(() => RecurringExpense, (r) => r.category)
  recurringExpenses: RecurringExpense[];
}
