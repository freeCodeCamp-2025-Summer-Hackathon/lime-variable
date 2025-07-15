import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateFamilyDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name!: string;
}
