import { Check, Column, Entity, Unique, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { decimalTransformer } from '../common/decimal.transformer';

@Entity({ name: 'Budgets' })
@Unique(['userId', 'categoryId', 'budgetMonth'])
@Check(`\`MonthlyLimit\` > 0`)
@Check(`\`AlertThreshold\` BETWEEN 1 AND 100`)
export class Budget {
  @PrimaryGeneratedColumn({ name: 'BudgetID' })
  budgetId: number;

  @Column({ name: 'UserID', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'CategoryID', type: 'int', nullable: false })
  categoryId: number;

  @Column({ name: 'MonthlyLimit', type: 'decimal', precision: 10, scale: 2, nullable: false, transformer: decimalTransformer })
  monthlyLimit: number;

  @Column({ name: 'BudgetMonth', type: 'date', nullable: false })
  budgetMonth: string;

  @Column({ name: 'AlertThreshold', type: 'int', nullable: false, default: 80 })
  alertThreshold: number;

  @ManyToOne(() => User, (u) => u.budgets, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserID' })
  user: User;

  @ManyToOne(() => Category, (c) => c.budgets, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CategoryID' })
  category: Category;
}
