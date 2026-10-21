import { IsEmail, Length, Matches } from 'class-validator';
import { MESSAGES, REGEXES } from '../../shared/utils/regex.utils';

export class UpdateUserDto {
  @IsEmail()
  email?: string;

  @Length(1, 20)
  firstname?: string;

  @Length(1, 20)
  lastname?: string;

  @Matches(REGEXES.PASSWORD_REGEX, { message: MESSAGES.PASSWORD_REGEX_MESSAGE })
  password?: string;

  authMethod?: string;
}
