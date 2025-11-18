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
        const player = await this.db
            .insertInto('users')
            .values(user)
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
            .executeTakeFirst();

        if (toolId) {
            return await this.db
                .insertInto('user_tools')
                .values({
                    user_id: userId,
                    tool_id: toolId.id
                })
                .execute();
        }
    }
}