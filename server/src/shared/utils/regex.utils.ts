// Regexes to match user input
const PASSWORD_REGEX = /^.{8,64}$/su;

export const REGEXES = { PASSWORD_REGEX };

// Messages displayed when input does not match regex
const PASSWORD_REGEX_MESSAGE = 'Password must be 8 to 64 characters long.';

export const MESSAGES = { PASSWORD_REGEX_MESSAGE };
