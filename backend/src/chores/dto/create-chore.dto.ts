import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ChoreStatus } from 'generated/prisma';

export class CreateChoreDto {
  @ApiProperty({
    description: 'Title of the chore',
    example: 'Clean the kitchen',
    required: true,
    type: String,
  })
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;
  //
  @ApiProperty({
    description: 'Points assigned to the chore',
    example: 10,
    required: true,
    type: Number,
  })
  @IsNumber({}, { message: 'Points must be a number' })
  @IsNotEmpty({ message: 'Points cannot be empty' })
  points: number;
  //
  @ApiProperty({
    description: 'Status of the chore',
    example: ChoreStatus,
    required: true,
    enum: ChoreStatus,
  })
  @IsEnum(ChoreStatus, {
    message:
      'Status must be a valid enum value: either pending, submitted, approved, or rejected',
  })
  @IsNotEmpty({ message: 'Status cannot be empty' })
  status = ChoreStatus.PENDING;

  //
  @ApiProperty({
    description: 'Assigned by user ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: true,
    type: String,
  })
  @IsUUID('all', { message: 'Assigned by must be a valid UUID' })
  @IsNotEmpty({ message: 'Assigned by cannot be empty' })
  assignedBy: string;

  // Optional fields
  @ApiProperty({
    description: 'Proof photo URL',
    example: 'https://example.com/photo.jpg',
    required: false,
    type: String,
  })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  proofPhotoUrl?: string;

  //
  @ApiProperty({
    description: 'Assigned to user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: String,
  })
  @IsUUID('all', { message: 'Assigned to must be a valid UUID' })
  assignedTo?: string;

  //
  @ApiProperty({
    description: 'Due date for the chore',
    example: '2023-12-31T23:59:59.999Z',
    required: false,
    type: String,
  })
  @IsDate({ message: 'Due date must be a valid date' })
  @Type(() => Date)
  dueDate?: Date;
  //
  @ApiProperty({
    description: 'Description of the chore',
    example: 'Clean the kitchen thoroughly including dishes and floor',
    required: false,
    type: String,
  })
  @IsString({ message: 'Description must be a string' })
  description?: string;
  @ApiProperty({
    description: 'Submitted at date',
    example: '2023-12-01T12:00:00.000Z',
    required: false,
    type: String,
  })
  @IsDate({ message: 'Submitted at must be a valid date' })
  @Type(() => Date)
  submittedAt?: Date;
  //
  @ApiProperty({
    description: 'Approved at date',
    example: '2023-12-01T12:00:00.000Z',
    required: false,
    type: String,
  })
  @IsDate({ message: 'Approved at must be a valid date' })
  @Type(() => Date)
  approvedAt?: Date;
  //
  @ApiProperty({
    description: 'Rejected at date',
    example: '2023-12-01T12:00:00.000Z',
    required: false,
    type: String,
  })
  @IsDate({ message: 'Rejected at must be a valid date' })
  @Type(() => Date)
  rejectedAt?: Date;
}
