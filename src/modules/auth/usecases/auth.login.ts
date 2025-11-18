import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Kysely, Selectable } from "kysely";
import { DB, Users } from "kysely-codegen";
import { InjectKysely } from "nestjs-kysely";
import * as bcrypt from "bcrypt";
import Redis from "ioredis";

@Injectable()
export class LoginUsecase {
    constructor(
        @InjectKysely() private readonly db: Kysely<DB>,
        @Inject('REDIS_CLIENT') private readonly redis: Redis
    ) {}

    async execute(user: Selectable<Users>) {
        const userDb = await this.db
            .selectFrom('users')
            .select('password_hash')
            .where('username', '=', user.username)
            .executeTakeFirstOrThrow();

        if (!userDb) {
            throw new BadRequestException('Invalid credentials');
        }
        
        const isValid = bcrypt.compare(user.password_hash, userDb.password_hash);
        
        if (!isValid) {
            throw new BadRequestException('Invalid credentials');
        }

        return true;
    }
}