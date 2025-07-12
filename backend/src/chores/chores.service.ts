import { Injectable, NotFoundException } from '@nestjs/common';
import { ChoreStatus } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChoreDto } from './dto/create-chore.dto';
import { UpdateChoreDto } from './dto/update-chore.dto';

@Injectable()
export class ChoresService {
  constructor(private prisma: PrismaService) {}
  async create(createChoreDto: CreateChoreDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: 'bf6f208f-faa7-4239-b8ad-34c6ab5ce577' }, // hard coded for until authGuard ia created
    });

    if (!user) throw new NotFoundException('User not found');

    const updatedChoreDto = {
      ...createChoreDto,
      createdBy: user.id,
      status: ChoreStatus.PENDING,
      assignedTo: createChoreDto.assignedTo ?? null,
      assignedBy: user.id,
    };

    if (createChoreDto.assignedTo) {
      const assignedUser = await this.prisma.user.findUnique({
        where: { id: createChoreDto.assignedTo },
      });

      if (!assignedUser) throw new NotFoundException('Assigned user not found');

      updatedChoreDto.assignedTo = assignedUser.id;
    }

    const createdChore = await this.prisma.chore.create({
      data: updatedChoreDto,
    });

    if (!createdChore)
      throw new NotFoundException('Chore could not be created');

    return createdChore;
  }

  findAll() {
    return `This action returns all chores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chore`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateChoreDto: UpdateChoreDto) {
    return `This action updates a #${id} chore`;
  }

  remove(id: number) {
    return `This action removes a #${id} chore`;
  }
}
