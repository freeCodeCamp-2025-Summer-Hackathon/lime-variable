import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignChoreDto {
  @IsNotEmpty()
  @IsUUID()
  assignedTo: string;
}
