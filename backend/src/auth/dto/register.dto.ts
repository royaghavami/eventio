import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '@/common/enums';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsIn([UserRole.ATTENDEE, UserRole.ORGANIZER])
  role?: UserRole;

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;
}
