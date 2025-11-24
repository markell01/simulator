import { Injectable } from "@nestjs/common";
import { Insertable, Kysely } from "kysely";
import { InjectKysely } from "nestjs-kysely";
import { DB, Users } from "kysely-codegen";
import * as bcrypt from "bcrypt";
import { UserCreateDto } from "../dto/auth.dto";

@Injectable()
export class RegistrationUsecase {
    constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

    async execute(user: UserCreateDto) {
        const hash = await bcrypt.hash(user.password, 10);
        const player = await this.db
            .insertInto('users')
            .values({
                username: user.username,
                password_hash: hash
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        await this.getAxe(player.id)

        return player;
    }

    private async getAxe(userId: string) {
        const toolId = await this.db
            .selectFrom('tools')
            .select('id')
            .where('name', '=', 'Axe')
            .executeTakeFirstOrThrow();

        return await this.db
            .insertInto('user_tools')
            .values({
                user_id: userId,
                tool_id: toolId.id
            })
            .returningAll()
            .execute();
    }
}