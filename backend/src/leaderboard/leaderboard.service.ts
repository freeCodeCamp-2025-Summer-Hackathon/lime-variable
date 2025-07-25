import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}
  getLeaderBoard(familyId: string | null) {
    if (!familyId) {
      throw new BadRequestException('Family ID is required to get leaderboard');
    }
    return this.prisma.user.findMany({
      where: { familyId },
      orderBy: { points: 'desc' },
      select: {
        id: true,
        name: true,
        points: true,
      },
    });
  }
}
