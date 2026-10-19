import { existsSync } from 'fs';
import { DataSource, DataSourceOptions } from 'typeorm';

if (existsSync('../.env')) {
  process.loadEnvFile('../.env');
}
const data = process.env;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: data.REACT_APP_DB_HOST,
  port: parseInt(data.REACT_APP_DB_PORT),
  username: data.REACT_APP_DB_USERNAME,
  password: data.REACT_APP_DB_PASSWORD,
  database: data.REACT_APP_DB_NAME,
  // https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/**/*{.js,.ts}'],
  synchronize: false,
  logging: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
