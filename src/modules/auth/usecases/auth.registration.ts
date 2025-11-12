import { Injectable } from "@nestjs/common";
import { Insertable, Kysely } from "kysely";
import { InjectKysely } from "nestjs-kysely";
import { DB, Users } from "kysely-codegen";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthRegistration {
    constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

    async createUser(user: Insertable<Users>) {
        return await this.db
            .insertInto('users')
            .values(user)
    }

    async hashPassword(password: string) {
        
    }
}