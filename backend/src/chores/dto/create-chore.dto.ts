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
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @IsNumber({}, { message: 'Points must be a number' })
  @IsNotEmpty({ message: 'Points cannot be empty' })
  points: number;

  // Optional fields

  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @IsOptional()
  proofPhotoUrl?: string;

  @IsUUID('all', { message: 'Assigned to must be a valid UUID' })
  @IsOptional()
  assignedTo?: string;

  @IsDate({ message: 'Due date must be a valid date' })
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;
}
