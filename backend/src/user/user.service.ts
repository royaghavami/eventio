import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '@/common/enums';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      relations: ['organizer'],
    });
  }

  findById(id: number) {
    return this.userRepo.findOne({
      where: { id },
      relations: ['organizer'],
    });
  }

  create(data: Partial<User>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async updateRole(userId: number, role: UserRole) {
    await this.userRepo.update(userId, { role });
    return this.findById(userId);
  }
}
