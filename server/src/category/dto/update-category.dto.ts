import { IsInt, IsOptional, Length, Min } from 'class-validator';

export class UpdateCategoryDto {
  @Length(0, 30)
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  index?: number;
}
