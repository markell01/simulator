import { Injectable } from '@nestjs/common';
import { Insertable, Kysely, Selectable } from 'kysely';
import { DB, MiningSessions, ResourceTypes } from 'kysely-codegen';
import { InjectKysely } from 'nestjs-kysely';

@Injectable()
export class ResourcesService {
    constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

    async createResource(resource: Insertable<ResourceTypes>) {
        return await this.db
            .insertInto('resource_types')
            .values(resource)
            .returningAll()
            .executeTakeFirstOrThrow();
    }

    async getResourceInfo(name: string) {
        return await this.db
            .selectFrom('resource_types')
            .selectAll()
            .where('name', '=', name)
            .executeTakeFirstOrThrow();
    }

    async strartMineResource(userId: string, name: string) {
        const resource = await this.db
            .selectFrom('resource_types')
            .selectAll()
            .where('name', '=', name)
            .executeTakeFirstOrThrow(); 
        
        const tool = await this.db
            .selectFrom('user_tools')
            .innerJoin('tools', 'tools.id', 'user_tools.tool_id')
            .select([
                'user_tools.id',
                'user_tools.level',
                'user_tools.efficiency_multiplier',
                'user_tools.unlocked',
                'tools.name as tool_name',
                'tools.max_level',
            ])
            .where('user_tools.user_id', '=', userId)
            .where('tools.name', '=', 'Axe')
            .executeTakeFirstOrThrow();
        
        const actual_time = resource.base_time_ms * tool.efficiency_multiplier;
        
        const now = new Date();
        const finish_time = new Date(now.getTime() + actual_time);

        const mining_sessions = this.db
            .insertInto('mining_sessions')
            .values({

            })
    }
}
