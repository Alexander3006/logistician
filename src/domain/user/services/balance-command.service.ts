import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import BigNumber from 'bignumber.js';
import { AppException } from 'src/common/exceptions';
import { UserErrorCode } from '../constants';
import { UserBalance } from '../entities/user-balance.entity';

export class UserBalanceCommandServiceException extends AppException {}

@Injectable()
export class UserBalanceCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async checkBalance(
    userId: string,
    currencyId: string,
    amount: string,
    em: EntityManager,
  ): Promise<boolean> {
    const repository = em.getRepository(UserBalance);
    const balance = await repository.findOne({
      where: {
        userId,
        currencyId,
      },
      lock: { mode: 'pessimistic_write' },
    });
    const enought =
      new BigNumber(balance?.balance ?? '0').comparedTo(amount) >= 0;
    return enought;
  }

  async incrementBalance(
    userId: string,
    currencyId: string,
    amount: string,
    em: EntityManager,
  ): Promise<UserBalance> {
    const repository = em.getRepository(UserBalance);
    const balance = await repository.findOne({
      where: {
        userId,
        currencyId,
      },
      lock: { mode: 'pessimistic_write' },
    });
    if (!balance) {
      const entity = UserBalance.create({
        userId,
        currencyId,
        balance: amount,
      });
      const balance = await repository.save(entity);
      return balance;
    }
    await repository.update(
      { userId, currencyId },
      {
        balance: new BigNumber(balance.balance).plus(amount).toFixed(),
      },
    );
    return await repository.findOne({
      where: {
        userId,
        currencyId,
      },
    });
  }

  async decrementBalance(
    userId: string,
    currencyId: string,
    amount: string,
    em: EntityManager,
    allowNegativeBalance = false,
  ): Promise<UserBalance> {
    const repository = em.getRepository(UserBalance);
    const balance = await repository.findOne({
      where: {
        userId,
        currencyId,
      },
      lock: { mode: 'pessimistic_write' },
    });
    if (!balance) {
      if (!allowNegativeBalance && amount !== '0')
        throw new UserBalanceCommandServiceException({
          statusCode: 404,
          code: UserErrorCode.BALANCE_NOT_FOUND,
          message: 'Balance not found',
        });
      const entity = UserBalance.create({
        userId,
        currencyId,
        balance: new BigNumber(0).minus(amount).toFixed(),
      });
      const balance = await repository.save(entity);
      return balance;
    }

    if (
      !allowNegativeBalance &&
      new BigNumber(balance.balance).comparedTo(amount) < 0
    )
      throw new UserBalanceCommandServiceException({
        code: UserErrorCode.INFFICIENT_FUNDS,
        statusCode: 402,
        message: 'Insufficient funds',
      });
    await repository.update(
      { userId, currencyId },
      {
        balance: new BigNumber(balance.balance).minus(amount).toFixed(),
      },
    );
    return await repository.findOne({
      where: {
        userId,
        currencyId,
      },
    });
  }
}
