import { IsEnum, IsNotEmpty } from 'class-validator';

export class ApprovalChoreDto {
  @IsNotEmpty()
  @IsEnum(['REJECTED', 'APPROVED'])
  status: 'APPROVED' | 'REJECTED';
}
