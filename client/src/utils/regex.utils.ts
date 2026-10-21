// Regexes to match user input
const PASSWORD_REGEX = /^.{8,64}$/su;

const EMAIL_REGEX =
  /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const NAME_REGEX = /^[a-z ,.'-]{2,20}$/i;

export const REGEXES = { PASSWORD_REGEX, EMAIL_REGEX, NAME_REGEX };

// Messages displayed when input does not match regex
const PASSWORD_REGEX_MESSAGE = 'Password must be 8 to 64 characters long.';

const EMAIL_REGEX_MESSAGE = 'Please provide a valid email.';

const NAME_REGEX_MESSAGE =
  'Invalid Name Format. Please enter a name containing 2 to 20 characters, with no special characters.';

export const MESSAGES = {
  PASSWORD_REGEX_MESSAGE,
  EMAIL_REGEX_MESSAGE,
  NAME_REGEX_MESSAGE,
};
