import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from 'generated/prisma';
import { ValidationUtil } from 'src/utils/validation.util';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
// Stc1234
type UpdateUser = Pick<User, 'id' | 'name' | 'email' | 'role' | 'familyId'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // PUBLIC METHODS (used by controllers)

  async create(payload: CreateUserDto) {
    const hashedPassword = await argon.hash(payload.password, {
      type: argon.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 1,
    });

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

  async getMe(user: AuthenticatedUser) {
    const userData = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      omit: {
        passwordHash: true,
      },
    });

    if (!userData) {
      throw new NotFoundException('User data not found');
    }

    return userData;
  }

  async getFamilyMembers(user: AuthenticatedUser, familyId: string) {
    const family = await this.prisma.family.findUnique({
      where: {
        id: familyId,
      },
      include: {
        members: {
          omit: {
            passwordHash: true,
          },
        },
      },
    });

    if (!family) throw new NotFoundException('Family not found');
    if (!family.members.length) {
      throw new NotFoundException('Users not found in this families');
    }
    if (!family.members.some((member) => member.id === user.id)) {
      throw new ForbiddenException("You can't access others families");
    }

    return family.members;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        passwordHash: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateFamilyMember(
    currentUserId: string,
    currentUserRole: UserRole,
    familyId: string,
    userId: string,
    dto: UpdateUserDto,
  ) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }
    if (currentUserRole === 'CHILD' && (dto.role || dto.familyId)) {
      throw new UnauthorizedException("You can't change your role or family");
    }

    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
      select: { id: true, name: true, email: true, familyId: true, role: true },
    });

    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }
    if (currentUser.familyId !== familyId) {
      throw new ForbiddenException(
        'You can only update users in your own family',
      );
    }

    const targetUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
        familyId: familyId,
      },
      select: { id: true, role: true, name: true, email: true, familyId: true },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found in this family');
    }

    this.validateUpdatePermissions(
      currentUser,
      targetUser,
      dto,
      userId,
      currentUserId,
    );

    if (dto.email && !ValidationUtil.isValidEmail(dto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Check for email uniqueness if email is being updated
    if (dto.email && dto.email !== targetUser.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email already in use');
      }
    }

    const updateData = this.prepareUpdateData(currentUserRole, dto);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
        familyId: familyId,
      },
      data: updateData,
      omit: {
        passwordHash: true,
      },
    });

    return updatedUser;
  }

  async remove(currentUserRole: UserRole, deleteId: string) {
    if (currentUserRole === 'CHILD') {
      throw new UnauthorizedException(
        'Contact your parent to delete your account',
      );
    }
    const user = await this.prisma.user.findUnique({ where: { id: deleteId } });

    if (!user) {
      throw new NotFoundException(`User account not found`);
    }

    if (user.role === UserRole.CHILD || !user.familyId) {
      await this.prisma.user.delete({ where: { id: deleteId } });
    } else {
      if (user.id !== deleteId) {
        throw new ForbiddenException("You can't delete other parent account");
      } else {
        const otherMembers = await this.prisma.family.findUnique({
          where: {
            id: user.familyId,
          },
          select: {
            members: true,
          },
        });

        const otherParent = otherMembers?.members.filter(
          (usr) => usr.role === 'PARENT' && usr.id !== user.id,
        );

        if (otherParent && otherParent.length > 0) {
          await this.prisma.user.delete({ where: { id: deleteId } });
        } else {
          const familyId = user.familyId;

          await this.prisma.user.deleteMany({
            where: {
              familyId: familyId,
            },
          });
          await this.prisma.family.delete({
            where: {
              id: familyId,
            },
          });
        }
      }
    }
  }

  // PRIVATE HELPER METHODS start from here

  private validateUpdatePermissions(
    currentUser: UpdateUser,
    targetUser: UpdateUser,
    dto: UpdateUserDto,
    userId: string,
    currentUserId: string,
  ) {
    const isUpdatingSelf = userId === currentUserId;
    const isChild = currentUser.role === UserRole.CHILD;
    const isParent = currentUser.role === UserRole.PARENT;

    if (isChild) {
      if (!isUpdatingSelf) {
        throw new ForbiddenException(
          'Children can only update their own profile',
        );
      }

      if (dto.role || dto.familyId) {
        throw new ForbiddenException("Children can't change role or family");
      }
    }

    // Only parents can promote/demote users
    if (dto.role && dto.role !== targetUser.role && !isParent) {
      throw new ForbiddenException('Only parents can change user roles');
    }
  }

  private prepareUpdateData(currentUserRole: UserRole, dto: UpdateUserDto) {
    const updatedData: Partial<Omit<User, 'passwordHash' | 'id'>> = {};

    if (dto.name !== undefined) {
      updatedData.name = dto.name;
    }

    if (dto.email !== undefined) {
      updatedData.email = dto.email;
    }

    if (currentUserRole === UserRole.PARENT) {
      if (dto.role !== undefined) {
        updatedData.role = dto.role;
      }
      if (dto.familyId !== undefined) {
        updatedData.familyId = dto.familyId;
      }
    }

    return updatedData;
  }
}
