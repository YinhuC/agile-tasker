import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @MaxLength(20)
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsEmail({}, { each: true })
  emails?: string[];
}
