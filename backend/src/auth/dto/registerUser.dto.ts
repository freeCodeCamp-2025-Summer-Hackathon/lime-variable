import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum UserRole {
  PARENT,
  CHILD
}

export class RegisterUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  passwordHash!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}