import { IsInt, IsOptional, Length, Min } from 'class-validator';
import { IsRowId } from '../../shared/utils/row-id.utils';

export class UpdateTaskDto {
  @Length(0, 50)
  @IsOptional()
  name?: string;

  @Length(0, 200)
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  index?: number;

  @IsRowId()
  categoryId: number;
}
