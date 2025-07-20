import { Module } from '@nestjs/common';
import { FamiliesController } from './families.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FamiliesService } from './families.service';

@Module({
  controllers: [FamiliesController],
  providers: [FamiliesService, PrismaService],
})
export class FamiliesModule {}
