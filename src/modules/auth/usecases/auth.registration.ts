import { Injectable } from "@nestjs/common";
import { Insertable, Kysely } from "kysely";
import { InjectKysely } from "nestjs-kysely";
import { DB, Users } from "kysely-codegen";
import * as bcrypt from "bcrypt";

@Injectable()
export class RegistrationUsecase {
    constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

    async execute(user: Insertable<Users>) {
        const hash = await bcrypt.hash(user.password_hash, 10);
        user.password_hash = hash
        return await this.db
            .insertInto('users')
            .values(user)
            .returningAll()
            .executeTakeFirstOrThrow();
    }
}