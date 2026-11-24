import { IsIn, IsOptional } from 'class-validator';

export class QueryCategoryDto {
  @IsOptional()
  @IsIn(['Income', 'Expense'], { message: "categoryType must be 'Income' or 'Expense'." })
  categoryType?: 'Income' | 'Expense';
}
