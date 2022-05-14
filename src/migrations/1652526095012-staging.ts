import { MigrationInterface, QueryRunner } from 'typeorm';

export class staging1652526095012 implements MigrationInterface {
  name = 'staging1652526095012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "cart_session"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_7f4973e0fae856dd233f4e805d4" FOREIGN KEY ("session") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_c1d37879cbe54593c3a7be3665e" FOREIGN KEY ("idname") REFERENCES "products"("idname") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_c1d37879cbe54593c3a7be3665e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_7f4973e0fae856dd233f4e805d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "cart_session" FOREIGN KEY ("session") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
