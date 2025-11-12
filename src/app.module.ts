import { Module } from '@nestjs/common';
import { PostgresDialect } from 'kysely';
import { KyselyModule } from 'nestjs-kysely';
import { Pool } from 'pg';

@Module({
  imports: [
    KyselyModule.forRoot({
    dialect: new PostgresDialect({
        pool: new Pool({
          database: 'habrdb',
          host: 'localhost',
          user: 'habrpguser',
          password: 'pgpwd4habr',
          port: 5434,
          max: 10,
        })
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
