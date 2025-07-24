import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChoreStatus } from 'generated/prisma';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApprovalChoreDto } from './dto/approve-chore.dto';
import { AssignChoreDto } from './dto/assign-chore.dto';
import { CreateChoreDto } from './dto/create-chore.dto';
import { UpdateChoreDto } from './dto/update-chore.dto';

@Injectable()
export class ChoresService {
  constructor(private prisma: PrismaService) {}
  async create(createChoreDto: CreateChoreDto, user: AuthenticatedUser) {
    if (!user.familyId)
      throw new BadRequestException('You must have a family to create a chore');

    const updatedChoreDto = {
      ...createChoreDto,
      createdBy: user.id,
      status: ChoreStatus.PENDING,
      assignedTo: createChoreDto.assignedTo || null,
      familyId: user.familyId,
      assignedBy: createChoreDto.assignedTo ? user.id : null,
    };
    if (createChoreDto.assignedTo) {
      const assignedUser = await this.prisma.user.findUnique({
        where: { id: createChoreDto.assignedTo },
      });

      if (!assignedUser)
        throw new BadRequestException('Assigned user not found');

      updatedChoreDto.assignedTo = assignedUser.id;
    }

    try {
      const createdChore = await this.prisma.chore.create({
        data: updatedChoreDto,
      });

      return createdChore;
    } catch (error) {
      throw new InternalServerErrorException('Chore could not be created', {
        cause: error,
      });
    }
  }

  async assign(
    choreId: string,
    userToBeAssigned: AssignChoreDto['assignedTo'],
    user: AuthenticatedUser,
  ) {
    const chore = await this.prisma.chore.findUnique({
      where: { id: choreId },
    });

    if (!chore) throw new NotFoundException('Chore does not exist');

    if (user.familyId !== chore.familyId)
      throw new ForbiddenException('You do not have access to this resource');

    const assignedUser = await this.prisma.user.findUnique({
      where: { id: userToBeAssigned },
    });

    if (!assignedUser) throw new BadRequestException('Assigned user not found');

    try {
      const updatedChore = await this.prisma.chore.update({
        where: { id: choreId },

        data: { assignedTo: assignedUser.id, assignedBy: user.id },
      });

      return updatedChore;
    } catch (error) {
      throw new InternalServerErrorException('Chore could not be assigned', {
        cause: error,
      });
    }
  }
  async approve(
    choreId: string,
    user: AuthenticatedUser,
    status: ApprovalChoreDto['status'],
  ) {
    const chore = await this.prisma.chore.findUnique({
      where: { id: choreId },
    });
    if (!chore) throw new NotFoundException('Chore does not exist');

    if (user.familyId !== chore.familyId)
      throw new ForbiddenException('You do not have access to this resource');

    if (chore.status !== ChoreStatus.SUBMITTED)
      throw new BadRequestException('Chore must be submitted before approval');

    const updateValues: Record<string, string | Date> = { status };

    if (status === 'APPROVED') {
      updateValues.approvedAt = new Date();
    }

    if (status === 'REJECTED') {
      updateValues.rejectedAt = new Date();
    }
    try {
      const updatedChore = await this.prisma.chore.update({
        where: { id: choreId },
        data: updateValues,
      });

      return updatedChore;
    } catch (error) {
      throw new InternalServerErrorException('Chore could not be approved', {
        cause: error,
      });
    }
  }

  async submit(choreId: string, userId: string) {
    const chore = await this.prisma.chore.findUnique({
      where: { id: choreId },
    });

    if (!chore) throw new NotFoundException('Chore does not exist');

    if (userId !== chore.assignedTo)
      throw new UnauthorizedException(
        'You do not have access to this resource',
      );

    try {
      const updatedChore = await this.prisma.chore.update({
        where: { id: choreId },
        data: { status: ChoreStatus.SUBMITTED, submittedAt: new Date() },
      });

      return updatedChore;
    } catch (error) {
      throw new InternalServerErrorException('Chore could not be submitted', {
        cause: error,
      });
    }
  }

  // ! add filter and f=remove user
  async findAll(user: AuthenticatedUser) {
    if (!user.familyId)
      throw new BadRequestException('You must have a family to fetch chores');
    try {
      const where: { familyId: string; assignedTo?: string } = {
        familyId: user.familyId,
      };
      // if user was a child

      const allChores = await this.prisma.chore.findMany({
        where,
      });

      return allChores;
    } catch (error) {
      throw new InternalServerErrorException('Could not fetch chores', {
        cause: error,
      });
    }
  }

  async findOne(user: AuthenticatedUser, choreId: string) {
    const chore = await this.prisma.chore.findUnique({
      where: { id: choreId },
    });

    if (!chore) throw new NotFoundException('Chore does not exist');

    if (user.familyId !== chore.familyId)
      throw new ForbiddenException('You do not have access to this resource');

    return chore;
  }

  async update(
    choreId: string,
    updateChoreDto: UpdateChoreDto,
    user: AuthenticatedUser,
  ) {
    const chore = await this.prisma.chore.findUnique({
      where: {
        id: choreId,
      },
    });

    if (!chore) throw new BadRequestException('Resource not found');

    if (chore.createdBy !== user.id)
      throw new ForbiddenException(
        'You do not have permission to update the resource',
      );

    try {
      const updatedChore = await this.prisma.chore.update({
        where: {
          id: choreId,
        },
        data: updateChoreDto,
      });

      return updatedChore;
    } catch (error) {
      throw new InternalServerErrorException('Chore could not be updated', {
        cause: error,
      });
    }
  }

  async remove(id: string, user: AuthenticatedUser) {
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
    try {
      await this.prisma.chore.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Chore could not be deleted', {
        cause: error,
      });
    }
  }
}
