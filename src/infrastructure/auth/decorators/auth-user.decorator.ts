import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/domain/user/entities/user.entity';

export type UserWithSessionId = User & { sessionId: string };

export const AuthUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserWithSessionId => {
    const request = GqlExecutionContext.create(ctx).getContext().req;
    const user = request.user;
    return user;
  },
);
