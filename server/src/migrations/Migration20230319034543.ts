import { Migration } from '@mikro-orm/migrations';

export class Migration20230319034543 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" drop column "updated_at";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" add column "updated_at" timestamptz(0) not null;');
  }

}
