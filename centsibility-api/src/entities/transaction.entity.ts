import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { decimalTransformer } from '../common/decimal.transformer';

@Entity({ name: 'Transactions' })
@Check(`\`Amount\` > 0`)
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'TransactionID' })
  transactionId: number;

  @Column({ name: 'UserID', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'CategoryID', type: 'int', nullable: false })
  categoryId: number;

  @Column({ name: 'Amount', type: 'decimal', precision: 10, scale: 2, nullable: false, transformer: decimalTransformer })
  amount: number;

  @Column({ name: 'TransactionDate', type: 'date', nullable: false })
  transactionDate: string;

  @Column({ name: 'Description', type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ name: 'ReceiptImagePath', type: 'varchar', length: 255, nullable: true })
  receiptImagePath: string | null;

  @ManyToOne(() => User, (u) => u.transactions, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserID' })
  user: User;

  // No cascade: a category with transactions cannot be deleted (gives the 409 in Lab 05)
  @ManyToOne(() => Category, (c) => c.transactions, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'CategoryID' })
  category: Category;
}
