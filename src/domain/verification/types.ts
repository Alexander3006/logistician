import { registerEnumType } from '@nestjs/graphql';

export enum VerificationStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}
registerEnumType(VerificationStatus, { name: 'VerificationStatus' });

export enum VerificationTargetType {
  USER = 'USER',
  CAR = 'CAR',
}
registerEnumType(VerificationTargetType, { name: 'VerificationTargetType' });

export const VerificationTargetTypeMap = {
  [VerificationTargetType.USER]: 'userId',
  [VerificationTargetType.CAR]: 'carId',
};
