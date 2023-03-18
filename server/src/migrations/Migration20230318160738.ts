import { Migration } from '@mikro-orm/migrations';

export class Migration20230318160738 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment" ("user__id" int not null, "post__id" int not null, "text" varchar(255) not null, constraint "comment_pkey" primary key ("user__id", "post__id"));');

    this.addSql('alter table "comment" add constraint "comment_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_post__id_foreign" foreign key ("post__id") references "post" ("_id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "comment" cascade;');
  }

}
