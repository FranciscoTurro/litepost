import { Migration } from '@mikro-orm/migrations';

export class Migration20230305184056 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "updoot" ("user__id" int not null, "post__id" int not null, "value" int not null, constraint "updoot_pkey" primary key ("user__id", "post__id"));');

    this.addSql('alter table "updoot" add constraint "updoot_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade;');
    this.addSql('alter table "updoot" add constraint "updoot_post__id_foreign" foreign key ("post__id") references "post" ("_id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "updoot" cascade;');
  }

}
