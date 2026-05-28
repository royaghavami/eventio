import { UserRole } from '@/common/enums';

export class JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
