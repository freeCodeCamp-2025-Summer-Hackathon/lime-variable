import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'generated/prisma';
import { ChoresService } from './chores.service';
import { ApprovalChoreDto } from './dto/approve-chore.dto';
import { AssignChoreDto } from './dto/assign-chore.dto';
import { CreateChoreDto } from './dto/create-chore.dto';
import { UpdateChoreDto } from './dto/update-chore.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Chores')
@Controller('chores')
export class ChoresController {
  constructor(private readonly choresService: ChoresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chore' })
  @ApiBadRequestResponse({
    description:
      'You must have a family to create a chore or assigned user not found',
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to create a chore',
  })
  @ApiInternalServerErrorResponse({ description: 'Chore could not be created' })
  create(@Body() createChoreDto: CreateChoreDto, @GetUser() user: User) {
    return this.choresService.create(createChoreDto, user);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign a chore to a user' })
  @ApiNotFoundResponse({ description: 'Chore does not exist' })
  @ApiBadRequestResponse({ description: 'Assigned user not found' })
  @ApiUnauthorizedResponse({
    description: 'You do not have access to this resource',
  })
  @ApiInternalServerErrorResponse({
    description: 'Chore could not be assigned',
  })
  assign(
    @Param('id') choreId: string,
    @Body() userToBeAssigned: AssignChoreDto,
    @GetUser() user: User,
  ) {
    return this.choresService.assign(
      choreId,
      userToBeAssigned.assignedTo,
      user,
    );
  }

  @Patch(':id/submit')
  @ApiOperation({ summary: 'Submit a chore for review' })
  @ApiNotFoundResponse({ description: 'Chore does not exist' })
  @ApiUnauthorizedResponse({
    description: 'Only assigned user can submit the chore',
  })
  @ApiInternalServerErrorResponse({
    description: 'Chore could not be submitted',
  })
  submit(@Param('id') choreId: string, @GetUser('id') userId: string) {
    return this.choresService.submit(choreId, userId);
  }

  @Patch(':id/approval')
  @ApiOperation({ summary: 'Approve or reject a submitted chore' })
  @ApiNotFoundResponse({ description: 'Chore does not exist' })
  @ApiUnauthorizedResponse({
    description: 'You do not have access to this resource',
  })
  @ApiBadRequestResponse({
    description: 'Chore must be submitted before approval',
  })
  @ApiInternalServerErrorResponse({
    description: 'Chore could not be approved',
  })
  approve(
    @Param('id') choreId: string,
    @Body() approvalChoreDto: ApprovalChoreDto,
    @GetUser() user: User,
  ) {
    return this.choresService.approve(choreId, user, approvalChoreDto.status);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chores created by the user' })
  @ApiInternalServerErrorResponse({ description: 'Could not fetch chores' })
  findAll(@GetUser() user: User) {
    return this.choresService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific chore by ID' })
  @ApiNotFoundResponse({ description: 'Chore does not exist' })
  @ApiUnauthorizedResponse({
    description: 'User is not the creator of the chore',
  })
  @ApiInternalServerErrorResponse({ description: 'Could not fetch chore' })
  findOne(@Param('id') choreId: string, @GetUser() user: User) {
    return this.choresService.findOne(user, choreId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific chore' })
  @ApiBadRequestResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to update the resource',
  })
  @ApiInternalServerErrorResponse({ description: 'Chore could not be updated' })
  update(
    @Param('id') choreId: string,
    @Body() updateChoreDto: UpdateChoreDto,
    @GetUser() user: User,
  ) {
    return this.choresService.update(choreId, updateChoreDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific chore' })
  @ApiBadRequestResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to delete the resource',
  })
  @ApiInternalServerErrorResponse({ description: 'Chore could not be deleted' })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.choresService.remove(id, user);
  }
}
