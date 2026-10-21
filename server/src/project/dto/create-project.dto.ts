import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsRowId } from '../../shared/utils/row-id.utils';

export class CreateProjectDto {
  @IsNotEmpty()
  @Length(0, 30)
  name: string;

  @IsOptional()
  @Length(0, 100)
  description: string;

  @IsRowId()
  groupId: number;
}
