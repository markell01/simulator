import { Module } from '@nestjs/common';
import { PostgresDialect } from 'kysely';
import { KyselyModule } from 'nestjs-kysely';
import { Pool } from 'pg';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { ResourcesModule } from './modules/resources/resources.module';

@Module({
  imports: [
    KyselyModule.forRoot({
    dialect: new PostgresDialect({
        pool: new Pool({
          database: 'habrdb',
          host: 'localhost',
          user: 'habrpguser',
          password: 'pgpwd4habr',
          port: 5432,
          max: 10,
        })
      }),
    }),
    RedisModule,
    AuthModule,
    ResourcesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
