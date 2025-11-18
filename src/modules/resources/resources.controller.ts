import { Body, Controller, Post } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import * as kysely from 'kysely';
import { ResourceTypes } from 'kysely-codegen';

@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourceService: ResourcesService) {}

    @Post('create')
    async createResource(@Body() resource: kysely.Insertable<ResourceTypes>) {
        try {
            return this.resourceService.createResource(resource);
        } catch(err) {
            return err;
        }
    }
}
