import { Module } from '@nestjs/common';
import { ChoresModule } from './chores/chores.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ChoresModule, PrismaModule],
})
export class AppModule {}
