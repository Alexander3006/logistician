import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserBalanceCommandService } from 'src/domain/user/services/balance-command.service';
import { EntityManager } from 'typeorm';
import {
  BalanceHistory,
  BalanceHistoryStatus,
} from '../entities/balance-history.entity';
import { CreateBalanceHistoryDTO } from '../dto/create-balance-history.dto';
import BigNumber from 'bignumber.js';

@Injectable()
export class BalanceHistoryCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly userBalanceCommandService: UserBalanceCommandService,
  ) {}

  async createBalanceTransaction(
    dto: CreateBalanceHistoryDTO,
    em: EntityManager,
    allowNegativeBalance = false,
  ): Promise<BalanceHistory> {
    const repository = em.getRepository(BalanceHistory);
    const entity = BalanceHistory.create({
      ...dto,
      status: BalanceHistoryStatus.PENDING,
    });
    const balanceHistory = await repository.save(entity);
    await this.userBalanceCommandService.decrementBalance(
      dto.userId,
      dto.outCurrencyId,
      dto.outAmount,
      em,
      allowNegativeBalance,
    );
    if (dto.feeAmount && dto.feeCurrencyId) {
      const allow =
        allowNegativeBalance ||
        (dto.feeCurrencyId === dto.inCurrencyId &&
          new BigNumber(dto.feeAmount).comparedTo(dto.inAmount) <= 0);
      await this.userBalanceCommandService.decrementBalance(
        dto.userId,
        dto.feeCurrencyId,
        dto.feeAmount,
        em,
        allow,
      );
    }
    return balanceHistory;
  }

  async cancelBalanceTransaction(
    balanceHistoryId: string,
    em: EntityManager,
  ): Promise<BalanceHistory> {
    const repository = em.getRepository(BalanceHistory);
    const entity = await repository.findOneOrFail({
      where: {
        id: balanceHistoryId,
        status: BalanceHistoryStatus.PENDING,
      },
      lock: { mode: 'pessimistic_write' },
    });
    await repository.update(
      { id: balanceHistoryId },
      { status: BalanceHistoryStatus.CANCELLED },
    );
    await this.userBalanceCommandService.incrementBalance(
      entity.userId,
      entity.outCurrencyId,
      entity.outAmount,
      em,
    );
    if (entity.feeAmount && entity.feeCurrencyId) {
      await this.userBalanceCommandService.incrementBalance(
        entity.userId,
        entity.feeCurrencyId,
        entity.feeAmount,
        em,
      );
    }
    const updated = await repository.findOne({
      where: { id: balanceHistoryId },
    });
    return updated;
  }

  async confirmBalanceTransaction(
    balanceHistoryId: string,
    em: EntityManager,
  ): Promise<BalanceHistory> {
    const repository = em.getRepository(BalanceHistory);
    const entity = await repository.findOneOrFail({
      where: {
        id: balanceHistoryId,
        status: BalanceHistoryStatus.PENDING,
      },
      lock: { mode: 'pessimistic_write' },
    });
    await repository.update(
      { id: balanceHistoryId },
      { status: BalanceHistoryStatus.COMPLETED },
    );
    await this.userBalanceCommandService.incrementBalance(
      entity.userId,
      entity.inCurrencyId,
      entity.inAmount,
      em,
    );
    const updated = await repository.findOne({
      where: { id: balanceHistoryId },
    });
    return updated;
  }
}
