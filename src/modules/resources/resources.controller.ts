import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { MiningDto, ResourceDto } from './dto/resource.dto';

@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourceService: ResourcesService) { }

    @Post('create')
    async createResource(@Body() resource: ResourceDto) {
        try {
            return await this.resourceService.createResource(resource);
        } catch (err) {
            return err;
        }
    }

    @Get('info')
    async getResource(@Body() data: { name: string }) {
        try {
            return await this.resourceService.getResourceInfo(data.name);
        } catch (err) {
            return err;
        }
    }

    @Post('start-mining')
    async start(@Body() data: MiningDto) {
        try {
            return await this.resourceService.startMineResource(data.userId, data.resource_name)
        } catch (err) {
            return err;
        }
    }

    @Post('finish-mining')
    async finish(@Body() data: { sessionId: string }) {
        try {
            return await this.resourceService.finishMineResource(data.sessionId)
        } catch (err) {
            return err;
        }
    }
}
