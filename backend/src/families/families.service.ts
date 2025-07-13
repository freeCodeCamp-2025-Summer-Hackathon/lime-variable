import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UserRole } from 'generated/prisma';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Injectable()
export class FamiliesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(role: UserRole, dto: CreateFamilyDto) {
    if (role === 'CHILD') {
      throw new UnauthorizedException(
        'Only Parents are allowed to manage Family info',
      );
    }

    return this.prisma.family.create({ data: dto });
  }

  async findAll(role: UserRole) {
    if (role === 'CHILD') {
      throw new UnauthorizedException(
        'Only Parents are allowed to view all families',
      );
    }
    return this.prisma.family.findMany();
  }

  async findOne(id: string) {
    const family = await this.prisma.family.findUnique({ where: { id } });
    if (!family) {
      throw new NotFoundException(`Family with ID "${id}" not found`);
    }
    return family;
  }

  async update(role: UserRole, id: string, dto: UpdateFamilyDto) {
    if (role === 'CHILD') {
      throw new UnauthorizedException(
        'Only Parents are allowed to manage Family info',
      );
    }
    const family = await this.prisma.family.findUnique({ where: { id } });
    if (!family) {
      throw new NotFoundException(`Family with ID "${id}" not found`);
    }
    return this.prisma.family.update({
      where: { id },
      data: dto,
    });
  }

  async remove(role: UserRole, id: string) {
    if (role === 'CHILD') {
      throw new UnauthorizedException(
        'Only Parents are allowed to manage Family info',
      );
    }
    const family = await this.prisma.family.findUnique({ where: { id } });
    if (!family) {
      throw new NotFoundException(`Family with ID "${id}" not found`);
    }
    return this.prisma.family.delete({ where: { id } });
  }
}
