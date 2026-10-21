import { IsRowId } from '../../shared/utils/row-id.utils';

export class GetProjectDto {
  @IsRowId()
  groupId: number;
}
