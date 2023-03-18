import { Migration } from '@mikro-orm/migrations';

export class Migration20230318164647 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" drop column "created_at";');
    this.addSql('alter table "comment" drop column "updated_at";');
  }

}
