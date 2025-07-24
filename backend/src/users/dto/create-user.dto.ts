import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UserRole } from 'generated/prisma';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

export class CreateUserDto extends RegisterUserDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsUUID()
  familyId: string;
}
