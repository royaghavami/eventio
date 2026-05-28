import { IsEnum, IsOptional } from 'class-validator';
import { EventStatus } from '@/common/enums';

export class AdminEventsQueryDto {
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
