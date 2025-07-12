import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
} from 'class-validator';

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

  // Optional fields
  @ApiProperty({
    description: 'Proof photo URL',
    example: 'https://example.com/photo.jpg',
    required: false,
    type: String,
  })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @IsOptional()
  proofPhotoUrl?: string;

  //
  @ApiProperty({
    description: 'Assigned to user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: String,
  })
  @IsUUID('all', { message: 'Assigned to must be a valid UUID' })
  @IsOptional()
  assignedTo?: string;

  //
  @ApiProperty({
    description: 'Due date for the chore',
    example: '2023-12-31T23:59:59.999Z',
    required: false,
    type: String,
  })
  @IsDate({ message: 'Due date must be a valid date' })
  @IsOptional()
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
  @IsOptional()
  description?: string;
}
