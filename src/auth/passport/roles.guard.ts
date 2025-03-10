import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwtGuard = new JwtAuthGuard(this.reflector);
    const isJwtValid = await jwtGuard.canActivate(context);
    if (!isJwtValid) {
      return false;
    }

    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;
    if (!user || !user.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access Denied, You not admin');
    }

    return true;
  }
}
