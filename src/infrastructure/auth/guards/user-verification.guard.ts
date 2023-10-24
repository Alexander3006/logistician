import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/domain/user/entities/user.entity';

export class UserVerificationGuard implements CanActivate {
  getRequest(context: ExecutionContext) {
    switch (context.getType()) {
      case 'http':
        return context.switchToHttp().getRequest();
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context);
    const user: User = request['user'];
    const verified = user?.verified;
    return verified;
  }
}
