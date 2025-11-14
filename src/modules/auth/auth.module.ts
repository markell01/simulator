import { Module } from '@nestjs/common';
import { AuthUsecases } from './usecases';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [...AuthUsecases]
})
export class AuthModule {}
