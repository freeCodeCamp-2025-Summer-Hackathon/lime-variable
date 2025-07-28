import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class StartChoreDto {
  @IsNotEmpty()
  @IsIn(['IN_PROGRESS'])
  @ApiProperty({ enum: ['IN_PROGRESS'] })
  status: 'IN_PROGRESS';
}
