import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UserRole } from 'generated/prisma';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

@Injectable()
export class FamiliesService {
  constructor(
    private readonly prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(user: AuthenticatedUser, dto: CreateFamilyDto) {
    const family = await this.prisma.family.create({ data: dto });

    const familyId = family.id;

    await this.usersService.updateFamilyMember(
      user.id,
      user.role,
      familyId,
      user.id,
      { familyId },
    );

    return family;
  }

  async findAll() {
    const families = await this.prisma.family.findMany();
    if (!families?.length) throw new NotFoundException('Families not found');
    return families;
  }

  async findOne(id: string) {
    const family = await this.prisma.family.findUnique({
      where: { id },
      include: {
        members: {
          omit: {
            passwordHash: true,
          },
        },
      },
    });
    if (!family) {
      throw new NotFoundException(`Family not found`);
    }
    return family;
  }

  async update(role: UserRole, id: string, dto: UpdateFamilyDto) {
    const family = await this.prisma.family.findUnique({ where: { id } });
    if (!family) {
      throw new NotFoundException(`Family with ID "${id}" not found`);
    }
    return this.prisma.family.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const family = await this.prisma.family.findUnique({ where: { id } });
    if (!family) {
      throw new NotFoundException(`Family with ID "${id}" not found`);
    }
    await this.prisma.family.delete({ where: { id } });
  }
}
