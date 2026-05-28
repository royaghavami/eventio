import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@/common/enums';
import { UserService } from '@/user/user.service';
import { OrganizersService } from '@/organizers/organizers.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly organizersService: OrganizersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const role =
      dto.role === UserRole.ORGANIZER ? UserRole.ORGANIZER : UserRole.ATTENDEE;
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.create({
      email: dto.email,
      passwordHash,
      role,
    });

    if (role === UserRole.ORGANIZER) {
      await this.organizersService.createProfile(
        user.id,
        dto.name ?? dto.email.split('@')[0],
      );
    }

    return this.buildAuthResponse(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user.id, user.email, user.role);
  }

  async me(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      organizer: user.organizer
        ? {
            id: user.organizer.id,
            name: user.organizer.name,
            avatarUrl: user.organizer.avatarUrl,
            city: user.organizer.city,
          }
        : null,
    };
  }

  private buildAuthResponse(userId: number, email: string, role: UserRole) {
    const payload: JwtPayload = { sub: userId, email, role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: userId, email, role },
    };
  }
}
