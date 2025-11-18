import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';
import { InjectKysely } from 'nestjs-kysely';

@Injectable()
export class UsersService {
    constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

    async getUserInventory(user_id: string) {
        return await this.db
            .selectFrom('inventory')
            .selectAll()
            .where('inventory.user_id', '=', user_id)
            .execute();
    }
}
