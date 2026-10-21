import { MigrationInterface, QueryRunner } from 'typeorm';

export class BoardIndexes1792563606724 implements MigrationInterface {
  name = 'BoardIndexes1792563606724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_52c607e3a6d9302ef629452294" ON "tasks" ("categoryId", "index") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3c4d0325fa617c256697dcbf05" ON "categories" ("projectId", "index") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e849c0fab3e6ddf3cb693fb0bf" ON "projects" ("groupId") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e849c0fab3e6ddf3cb693fb0bf"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3c4d0325fa617c256697dcbf05"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_52c607e3a6d9302ef629452294"`
    );
  }
}
