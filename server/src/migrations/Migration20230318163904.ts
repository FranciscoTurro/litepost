import { Migration } from '@mikro-orm/migrations';

export class Migration20230318163904 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" add column "_id" serial not null;');
    this.addSql('alter table "comment" drop constraint "comment_pkey";');
    this.addSql('alter table "comment" add constraint "comment_pkey" primary key ("_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" drop constraint "comment_pkey";');
    this.addSql('alter table "comment" drop column "_id";');
    this.addSql('alter table "comment" add constraint "comment_pkey" primary key ("user__id", "post__id");');
  }

}
