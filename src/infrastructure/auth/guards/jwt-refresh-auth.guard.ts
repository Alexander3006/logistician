import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from '../strategies/jwt-refresh.strategy';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard(StrategyName) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
