import { Injectable } from '@nestjs/common';
import { Insertable, Kysely } from 'kysely';
import { DB, ResourceTypes } from 'kysely-codegen';
import { InjectKysely } from 'nestjs-kysely';
import { ResourceDto } from './dto/resource.dto';

@Injectable()
export class ResourcesService {
    constructor(@InjectKysely() private readonly db: Kysely<DB>) { }

    async createResource(resource: ResourceDto) {
        return await this.db
            .insertInto('resource_types')
            .values({ ...resource })
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

    async startMineResource(userId: string, resource_name: string) {
        const resource = await this.db
            .selectFrom('resource_types')
            .selectAll()
            .where('name', '=', resource_name)
            .executeTakeFirstOrThrow();

        let mine_tool: string;

        switch (resource_name) {
            case ('Wood'):
                mine_tool = 'Axe'
                break;
            case ('Iron'):
                mine_tool = 'Pickaxe'
                break;
            case ('Wheat'):
                mine_tool = 'Sickle'
                break;
        }

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

        const user_buff = await this.db
            .selectFrom('user_buffs')
            .selectAll()
            .where('user_id', '=', userId)
            .executeTakeFirstOrThrow();

        const buff = await this.db
            .selectFrom('buffs')
            .selectAll()
            .where('id', '=', user_buff.buff_id)
            .executeTakeFirstOrThrow();

        const actual_time = resource.base_time_ms * tool.efficiency_multiplier * buff.speed_multiplier;

        const now = new Date();
        const finish_time = new Date(now.getTime() + actual_time);

        const mining_sessions = await this.db
            .insertInto('mining_sessions')
            .values({
                user_id: userId,
                resource_type_id: resource.id,
                start_time: now,
                finish_time,
                tool_id: tool.id
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return mining_sessions;
    }

    async finishMineResource(sessionId: string) {
        const mining_sessions = await this.db
            .selectFrom('mining_sessions')
            .selectAll()
            .where('mining_sessions.id', '=', sessionId)
            .executeTakeFirstOrThrow();

        const { base_yield } = await this.db
            .selectFrom('resource_types')
            .select('base_yield')
            .where('id', '=', mining_sessions.resource_type_id)
            .executeTakeFirstOrThrow();

        const { buff_id } = await this.db
            .selectFrom('user_buffs')
            .select('user_buffs.buff_id')
            .where('user_id', '=', mining_sessions.user_id)
            .executeTakeFirstOrThrow();

        const { yield_multiplier } = await this.db
            .selectFrom('buffs')
            .select('buffs.yield_multiplier')
            .where('id', '=', buff_id)
            .executeTakeFirstOrThrow();

        const tool = await this.db
            .selectFrom('tool_levels')
            .select('yield_multiplier')
            .where('tool_id', '=', mining_sessions.tool_id)
            .executeTakeFirstOrThrow();

        const now = new Date();

        if (now < mining_sessions.finish_time) {
            return {
                warning: 'Resources havent been extract yet!'
            }
        }

        const amount = base_yield * yield_multiplier * tool.yield_multiplier;

        const record = await this.db
            .insertInto('user_inventory')
            .values({
                user_id: mining_sessions.user_id,
                resource_type_id: mining_sessions.resource_type_id,
                quantity: amount,
            })
            .onConflict((oc) =>
                oc.columns(['user_id', 'resource_type_id'])
                    .doUpdateSet((eb) => ({
                        quantity: eb('user_inventory.quantity', '+', amount),
                        updated_at: new Date(),
                    }))
            )
            .returningAll()
            .executeTakeFirstOrThrow();
        
        return record;
    }
}
