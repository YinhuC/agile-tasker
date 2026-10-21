import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsRowId } from '../../shared/utils/row-id.utils';

export class CreateTaskDto {
  @Length(0, 50)
  @IsNotEmpty()
  name: string;

  @Length(0, 200)
  @IsOptional()
  description?: string;

  @IsRowId()
  categoryId: number;
}
