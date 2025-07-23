import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'generated/prisma';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { LeaderboardService } from './leaderboard.service';
@UseGuards(JwtGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({ summary: "Get leaderboard for user's families" })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved leaderboard',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clabc12345' },
          name: { type: 'string', example: 'Team Alpha' },
          points: { type: 'number', example: 1500 },
          // Add any other fields returned by `family.findMany`
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Require a family' })
  getLeaderBoard(@GetUser() user: User) {
    return this.leaderboardService.getLeaderBoard(user.familyId);
  }
}
