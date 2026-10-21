import { validateEnv } from './env.utils';

describe('validateEnv', () => {
  it('should return a complete config unchanged', () => {
    const config = {
      REACT_APP_DB_HOST: 'localhost',
      REACT_APP_DB_PORT: '5432',
      REACT_APP_DB_USERNAME: 'postgres',
      REACT_APP_DB_PASSWORD: '',
      REACT_APP_DB_NAME: 'agiletasker',
      REACT_APP_SECRET: 'a'.repeat(32),
      REACT_APP_CLIENT_URL: 'http://localhost:3000',
    };

    const result = validateEnv(config);

    expect(result).toEqual(config);
  });

  it('should name every missing or blank setting', () => {
    const config = {
      REACT_APP_DB_HOST: 'localhost',
      REACT_APP_DB_PORT: '5432',
      REACT_APP_DB_USERNAME: 'postgres',
      REACT_APP_SECRET: '',
    };

    expect(() => validateEnv(config)).toThrow(
      'Missing environment variables: REACT_APP_DB_NAME, REACT_APP_SECRET, REACT_APP_CLIENT_URL'
    );
  });

  it('should reject a session secret shorter than 32 characters', () => {
    const config = {
      REACT_APP_DB_HOST: 'localhost',
      REACT_APP_DB_PORT: '5432',
      REACT_APP_DB_USERNAME: 'postgres',
      REACT_APP_DB_NAME: 'agiletasker',
      REACT_APP_SECRET: 'a'.repeat(31),
      REACT_APP_CLIENT_URL: 'http://localhost:3000',
    };

    expect(() => validateEnv(config)).toThrow(
      'REACT_APP_SECRET must be at least 32 characters'
    );
  });
});
