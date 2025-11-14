import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { RegistrationUsecase } from './usecases/auth.registration';
import { Users } from 'kysely-codegen';
import type { Insertable, Selectable } from 'kysely';
import { LoginUsecase } from './usecases/auth.login';
import express from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly registrationUsecase: RegistrationUsecase,
        private readonly loginUsecase: LoginUsecase
    ) {}

    @Post('registration')
    async registration(@Body() user: Insertable<Users>) {
        try {
            const result = await this.registrationUsecase.execute(user);
            return result;
        } catch(err) {
            throw err;
        }
    }

    @Post('login')
    async login(
        @Body() user: Selectable<Users>,
        @Req() req: express.Request
    ) {
        try {
            const result = await this.loginUsecase.execute(user);
            req.session.user = { 
                username: user.username 
            };
            await new Promise<void>((resolve, reject) => {
                req.session.save((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            return { success: result };
        } catch(err) {
            throw err;
        }
    }

    @Get('logout')
    async logout(@Req() req: express.Request) {
        await new Promise<void>((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        return { success: true };
    }
}
