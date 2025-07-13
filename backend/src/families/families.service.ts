import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UserRole } from 'generated/prisma';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Injectable()
export class FamiliesService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ name }: CreateFamilyDto) {
    try {
      const family = await this.prisma.family.create({
        data: {
          name,
        },
      });

      return family;
    } catch (error) {
      console.log('Error', error);
    }
  }

  findAll(role: UserRole) {
    if (role === 'CHILD') {
      throw new UnauthorizedException(
        'Only Parents are allowed to manage Family info',
      );
    }
    return `This action returns all families ${role}`;
  }

  findOne(id: string) {
    return `This action returns this family:=> ${id}`;
  }

  update(id: string, dto: UpdateFamilyDto) {
    return `This action updates this family:=> #${id} ${dto.name}`;
  }

  remove(id: string) {
    return `This action removes this family:=> #${id}`;
  }
}
