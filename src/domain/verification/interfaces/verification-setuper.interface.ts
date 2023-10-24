import { EntityManager } from 'typeorm';

export interface IVerificationSetuper {
  setVerifiedStatus(
    id: string,
    status: boolean,
    em?: EntityManager,
  ): Promise<boolean>;

  checkAccess(id: string, userId: string, em?: EntityManager): Promise<boolean>;
}
