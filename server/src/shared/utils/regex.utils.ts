// Regexes to match user input
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const REGEXES = { PASSWORD_REGEX };

// Messages displayed when input does not match regex
const PASSWORD_REGEX_MESSAGE =
  'Password must be at least 8 characters long, contain a number, uppercase character and lower case character.';

export const MESSAGES = { PASSWORD_REGEX_MESSAGE };
