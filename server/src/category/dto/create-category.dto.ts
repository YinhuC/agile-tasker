import { IsNotEmpty, Length } from 'class-validator';
import { IsRowId } from '../../shared/utils/row-id.utils';

export class CreateCategoryDto {
  @Length(0, 30)
  @IsNotEmpty()
  name: string;

  @IsRowId()
  projectId: number;
}
