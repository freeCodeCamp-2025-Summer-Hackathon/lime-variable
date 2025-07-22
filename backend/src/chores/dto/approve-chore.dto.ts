import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class ApprovalChoreDto {
  @IsNotEmpty()
  @IsIn(['APPROVED', 'REJECTED'])
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'] })
  status: 'APPROVED' | 'REJECTED';
}
