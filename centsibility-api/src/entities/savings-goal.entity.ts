import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { decimalTransformer } from '../common/decimal.transformer';

@Entity({ name: 'SavingsGoals' })
@Check(`\`TargetAmount\` > 0`)
@Check(`\`CurrentAmount\` >= 0`)
@Check(`\`Status\` IN ('Active','Completed','Cancelled')`)
export class SavingsGoal {
  @PrimaryGeneratedColumn({ name: 'GoalID' })
  goalId: number;

  @Column({ name: 'UserID', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'GoalName', type: 'varchar', length: 100, nullable: false })
  goalName: string;

  @Column({ name: 'TargetAmount', type: 'decimal', precision: 10, scale: 2, nullable: false, transformer: decimalTransformer })
  targetAmount: number;

  @Column({ name: 'CurrentAmount', type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0, transformer: decimalTransformer })
  currentAmount: number;

  @Column({ name: 'TargetDate', type: 'date', nullable: true })
  targetDate: string | null;

  @Column({ name: 'Status', type: 'varchar', length: 15, nullable: false, default: 'Active' })
  status: 'Active' | 'Completed' | 'Cancelled';

  @ManyToOne(() => User, (u) => u.savingsGoals, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserID' })
  user: User;
}
