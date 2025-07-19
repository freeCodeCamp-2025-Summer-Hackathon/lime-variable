import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
    try {
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
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Chore could not be created', {
        cause: error,
      });
    }
  }
  // ! add filter and f=remove user
  async findAll(user: User) {
    try {
      const allChores = await this.prisma.chore.findMany({
        where: { createdBy: user.id },
      });

      return allChores;
    } catch (error) {
      throw new InternalServerErrorException('Could not fetch chores', {
        cause: error,
      });
    }
  }

  async findOne(userId: string, choreId: string) {
    try {
      const chore = await this.prisma.chore.findUnique({
        where: { id: choreId },
      });

      if (!chore) throw new NotFoundException('Chore does not exist');

      if (userId !== chore.createdBy)
        throw new UnauthorizedException(
          'You do not have access to this resource',
        );

      return chore;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Could not fetch chore', {
        cause: error,
      });
    }
  }

  async update(
    choreId: string,
    updateChoreDto: UpdateChoreDto,
    userId: User['id'],
  ) {
    try {
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
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      )
        throw error;

      throw new InternalServerErrorException('Chore could not be updated', {
        cause: error,
      });
    }
  }

  async remove(id: string, user: User) {
    try {
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
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      )
        throw error;

      throw new InternalServerErrorException('Chore could not be deleted', {
        cause: error,
      });
    }
  }
}
