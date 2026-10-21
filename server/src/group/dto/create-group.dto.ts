import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateGroupDTO {
  @IsNotEmpty()
  @Length(0, 20)
  name: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsEmail({}, { each: true })
  emails?: string[];
}
