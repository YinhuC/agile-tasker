const REQUIRED_ENV_KEYS = [
  'REACT_APP_DB_HOST',
  'REACT_APP_DB_PORT',
  'REACT_APP_DB_USERNAME',
  'REACT_APP_DB_NAME',
  'REACT_APP_SECRET',
  'REACT_APP_CLIENT_URL',
];
const MIN_SECRET_LENGTH = 32;

/** Fails the boot when a required setting is missing or the session secret is too short to sign cookies safely. */
export function validateEnv(
  config: Record<string, unknown>
): Record<string, unknown> {
  const missing = REQUIRED_ENV_KEYS.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  if (String(config.REACT_APP_SECRET).length < MIN_SECRET_LENGTH) {
    throw new Error(
      `REACT_APP_SECRET must be at least ${MIN_SECRET_LENGTH} characters`
    );
  }
  return config;
}
