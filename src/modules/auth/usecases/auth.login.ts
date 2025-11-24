import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Kysely, Selectable } from "kysely";
import { DB, Users } from "kysely-codegen";
import { InjectKysely } from "nestjs-kysely";
import * as bcrypt from "bcrypt";
import Redis from "ioredis";
import { UserLogin } from "../dto/auth.dto";

@Injectable()
export class LoginUsecase {
    constructor(@InjectKysely() private readonly db: Kysely<DB>) { }

    async execute(user: UserLogin) {
        const dbUser = await this.db
            .selectFrom('users')
            .select('password_hash')
            .where('username', '=', user.username)
            .executeTakeFirstOrThrow();

        if (!dbUser) {
            throw new BadRequestException('Invalid credentials');
        }

        const isValid = bcrypt.compare(user.password, dbUser.password_hash);

        if (!isValid) {
            throw new BadRequestException('Invalid credentials');
        }

        return true;
    }
}