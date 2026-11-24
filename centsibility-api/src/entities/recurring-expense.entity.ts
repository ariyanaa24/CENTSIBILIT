import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { decimalTransformer } from '../common/decimal.transformer';

@Entity({ name: 'RecurringExpenses' })
@Check(`\`Amount\` > 0`)
@Check(`\`Frequency\` IN ('Weekly','Monthly','Yearly')`)
export class RecurringExpense {
  @PrimaryGeneratedColumn({ name: 'RecurringID' })
  recurringId: number;

  @Column({ name: 'UserID', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'CategoryID', type: 'int', nullable: false })
  categoryId: number;

  @Column({ name: 'Description', type: 'varchar', length: 100, nullable: false })
  description: string;

  @Column({ name: 'Amount', type: 'decimal', precision: 10, scale: 2, nullable: false, transformer: decimalTransformer })
  amount: number;

  @Column({ name: 'Frequency', type: 'varchar', length: 10, nullable: false })
  frequency: 'Weekly' | 'Monthly' | 'Yearly';

  @Column({ name: 'NextDueDate', type: 'date', nullable: false })
  nextDueDate: string;

  @Column({ name: 'ReminderDaysBefore', type: 'int', nullable: false, default: 3 })
  reminderDaysBefore: number;

  @ManyToOne(() => User, (u) => u.recurringExpenses, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserID' })
  user: User;

  @ManyToOne(() => Category, (c) => c.recurringExpenses, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CategoryID' })
  category: Category;
}
