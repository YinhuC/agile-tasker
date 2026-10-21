import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';
import { MESSAGES, REGEXES } from '../../shared/utils/regex.utils';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(1, 20)
  firstname: string;

  @IsNotEmpty()
  @Length(1, 20)
  lastname: string;

  @IsDefined()
  @IsNotEmpty()
  @Matches(REGEXES.PASSWORD_REGEX, { message: MESSAGES.PASSWORD_REGEX_MESSAGE })
  password: string;

  authMethod?: string;
}
