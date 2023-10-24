import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from '../strategies/jwt.strategy';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyName) {
  getRequest(context: ExecutionContext) {
    switch (context.getType<GqlContextType>()) {
      case 'http':
        return context.switchToHttp().getRequest();
      case 'graphql':
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
