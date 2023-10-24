import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/domain/user/entities/user.entity';

export const ROLES_KEY = Symbol('roles');
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
