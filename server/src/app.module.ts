import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { GroupModule } from './group/group.module';
import { ProjectModule } from './project/project.module';
import { CategoryModule } from './category/category.module';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './shared/utils/env.utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'],
      validate: validateEnv,
    }),
    PassportModule.register({
      session: true,
    }),
    UserModule,
    AuthModule,
    GroupModule,
    ProjectModule,
    CategoryModule,
    TaskModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.REACT_APP_DB_HOST,
      port: parseInt(process.env.REACT_APP_DB_PORT),
      username: process.env.REACT_APP_DB_USERNAME,
      password: process.env.REACT_APP_DB_PASSWORD,
      database: process.env.REACT_APP_DB_NAME,
      // https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/database/migrations/**/*{.js,.ts}'],
      synchronize: false,
      logging:
        process.env.REACT_APP_NODE_ENV === 'production' ? ['error'] : true,
      poolSize: 5,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
