import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

enum ChoreStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
export class CreateChoreDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @IsNumber({}, { message: 'Points must be a number' })
  @IsNotEmpty({ message: 'Points cannot be empty' })
  points: number;

  @IsEnum(ChoreStatus, { message: 'Status must be a valid enum value' })
  @IsNotEmpty({ message: 'Status cannot be empty' })
  status = ChoreStatus.PENDING;

  @IsUUID('all', { message: 'Assigned to must be a valid UUID' })
  @IsNotEmpty({ message: 'Assigned to cannot be empty' })
  assignedTo: string;

  @IsUUID('all', { message: 'Assigned by must be a valid UUID' })
  @IsNotEmpty({ message: 'Assigned by cannot be empty' })
  assignedBy: string;

  @IsUUID('all', { message: 'Created by must be a valid UUID' })
  @IsNotEmpty({ message: 'Created by cannot be empty' })
  createdBy: string;

  // Optional fields
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  proofPhotoUrl?: string;

  @IsString({ message: 'Due date must be a string' })
  dueDate?: string;

  @IsDate({ message: 'Created at must be a valid date' })
  submittedAt?: Date;

  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsDate({ message: 'Approved at must be a valid date' })
  approvedAt?: Date;

  @IsDate({ message: 'Rejected at must be a valid date' })
  rejectedAt?: Date;
}
