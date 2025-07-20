import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateUserDto) {
    const hashedPassword = await argon.hash(payload.password);

    try {
      const family = await this.prisma.family.findUnique({
        where: {
          id: payload.familyId,
        },
      });

      if (!family) {
        throw new NotFoundException('Family not found');
      }

      const user = await this.prisma.user.create({
        data: {
          name: payload.name,
          passwordHash: hashedPassword,
          role: payload.role,
          email: payload.email,
          familyId: payload.familyId,
        },
      });

      //   eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...rest } = user;
      return rest;
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Credentials taken: Email ${payload.email} already used`,
        );
      }
      throw error;
    }
  }

  async getFamilyMembers(familyId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        familyId,
      },
      omit: {
        passwordHash: true,
      },
    });
    if (!users?.length)
      throw new NotFoundException('Users not found in this families');
    return users;
  }

  updateFamilyMember(familyId: string, userId: string, dto: UpdateUserDto) {
    if (!dto) {
      throw new BadRequestException(
        'Kindly provide data which needs to be updated.',
      );
    }
    return {
      familyId,
      userId,
      dto,
    };
  }
}
