import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ChoresModule } from './chores/chores.module';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FamiliesModule } from './families/families.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    PrismaModule,
    AuthModule,
    FamiliesModule,
    ChoresModule,
  ],
})
export class AppModule {}
