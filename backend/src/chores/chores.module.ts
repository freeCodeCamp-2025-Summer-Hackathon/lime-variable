import { Module } from '@nestjs/common';
import { ChoresService } from './chores.service';
import { ChoresController } from './chores.controller';

@Module({
  controllers: [ChoresController],
  providers: [ChoresService],
})
export class ChoresModule {}
