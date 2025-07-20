import { PartialType } from '@nestjs/swagger';
import { CreateChoreDto } from './create-chore.dto';

export class UpdateChoreDto extends PartialType(CreateChoreDto) {}
