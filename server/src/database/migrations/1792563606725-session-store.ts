import { MigrationInterface, QueryRunner } from 'typeorm';

/** Table for connect-pg-simple, the express-session store. It has no entity. */
export class SessionStore1792563606725 implements MigrationInterface {
  name = 'SessionStore1792563606725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session" ("sid" character varying NOT NULL, "sess" json NOT NULL, "expire" TIMESTAMP(6) NOT NULL, CONSTRAINT "session_pkey" PRIMARY KEY ("sid"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_session_expire" ON "session" ("expire") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_session_expire"`);
    await queryRunner.query(`DROP TABLE "session"`);
  }
}
