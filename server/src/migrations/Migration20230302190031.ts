import { Migration } from '@mikro-orm/migrations';

export class Migration20230302190031 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" add column "text" varchar(255) not null, add column "points" int not null default 0, add column "creator__id" int not null;');
    this.addSql('alter table "post" add constraint "post_creator__id_foreign" foreign key ("creator__id") references "user" ("_id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" drop constraint "post_creator__id_foreign";');

    this.addSql('alter table "post" drop column "text";');
    this.addSql('alter table "post" drop column "points";');
    this.addSql('alter table "post" drop column "creator__id";');
  }

}
