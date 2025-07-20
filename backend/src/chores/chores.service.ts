import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChoreStatus, User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChoreDto } from './dto/create-chore.dto';
import { UpdateChoreDto } from './dto/update-chore.dto';

@Injectable()
export class ChoresService {
  constructor(private prisma: PrismaService) {}
  async create(createChoreDto: CreateChoreDto, user: User) {
    const updatedChoreDto = {
      ...createChoreDto,
      createdBy: user.id,
      status: ChoreStatus.PENDING,
      assignedTo: createChoreDto.assignedTo || null,
      assignedBy: user.id,
    };
    if (createChoreDto.assignedTo) {
      const assignedUser = await this.prisma.user.findUnique({
        where: { id: createChoreDto.assignedTo },
      });

      if (!assignedUser)
        throw new BadRequestException('Assigned user not found');

      updatedChoreDto.assignedTo = assignedUser.id;
    }

    const createdChore = await this.prisma.chore.create({
      data: updatedChoreDto,
    });

    if (!createdChore) throw new Error('Chore could not be created');

    return createdChore;
  }
  // ! add filter and f=remove user
  async findAll(user: User) {
    const allChores = await this.prisma.chore.findMany({
      where: { createdBy: user.id },
    });

    return allChores;
  }

  async findOne(userId: string, choreId: string) {
    const chore = await this.prisma.chore.findUnique({
      where: { id: choreId },
    });

    if (!chore) throw new NotFoundException('Chore does not exist');

    if (userId !== chore.createdBy)
      throw new UnauthorizedException(
        'You do not have access to this resource',
      );

    return chore;
  }

  async update(
    choreId: string,
    updateChoreDto: UpdateChoreDto,
    userId: User['id'],
  ) {
    const chore = await this.prisma.chore.findUnique({
      where: {
        id: choreId,
      },
    });
    if (!chore) throw new BadRequestException('Resource not found');

    if (chore?.createdBy !== userId)
      throw new ForbiddenException(
        'You do not have permission to update the resource',
      );
    // TODO: remove id and createdby  and other backend props before updating

    const updatedChore = await this.prisma.chore.update({
      where: {
        id: choreId,
      },
      // ! check if more props are added
      data: updateChoreDto,
    });

    return updatedChore;
  }

  async remove(id: string, user: User) {
    if (user.role === 'CHILD') {
      throw new ForbiddenException(
        'You do not have permission to delete the resource',
      );
    }
    const chore = await this.prisma.chore.findUnique({
      where: { id },
    });

    if (!chore) throw new BadRequestException('Resource not found');

    if (chore.createdBy !== user.id)
      throw new ForbiddenException(
        'You do not have permission to delete the resource',
      );
    await this.prisma.chore.delete({
      where: { id },
    });
  }
}
