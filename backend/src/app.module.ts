import { Module } from '@nestjs/common';
import { ChoresModule } from './chores/chores.module';


import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    AuthModule,
    ChoresModule,
  ],
})
export class AppModule {}
