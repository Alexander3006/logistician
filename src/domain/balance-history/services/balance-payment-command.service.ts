import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { BalanceHistoryCommandService } from './balance-history-command.service';
import { CreateBalancePaymentDTO } from '../dto/create-balance-payment.dto';
import {
  BalancePayment,
  BalancePaymentStatus,
} from '../entities/balance-payment.entity';
import { BalanceHistoryType } from '../entities/balance-history.entity';

@Injectable()
export class BalancePaymentCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly balanceHistoryCommandService: BalanceHistoryCommandService,
  ) {}

  async createBalancePayment(
    dto: CreateBalancePaymentDTO,
    em: EntityManager,
  ): Promise<BalancePayment> {
    const repository = em.getRepository(BalancePayment);
    const senderBalanceHistory =
      await this.balanceHistoryCommandService.createBalanceTransaction(
        {
          inAmount: '0',
          inCurrencyId: dto.currencyId,
          outAmount: dto.amount,
          outCurrencyId: dto.currencyId,
          userId: dto.senderId,
          type: BalanceHistoryType.PAYMENT,
        },
        em,
      );
    const recipientBalanceHistory =
      await this.balanceHistoryCommandService.createBalanceTransaction(
        {
          inAmount: dto.amount,
          inCurrencyId: dto.currencyId,
          outAmount: '0',
          outCurrencyId: dto.currencyId,
          userId: dto.recipientId,
          type: BalanceHistoryType.DEPOSIT,
        },
        em,
      );
    const entity = BalancePayment.create({
      senderBalanceHistoryId: senderBalanceHistory.id,
      recipientBalanceHistoryId: recipientBalanceHistory.id,
      status: BalancePaymentStatus.PENDING,
    });
    const payment = await repository.save(entity);
    return payment;
  }

  async cancelBalancePayment(
    paymentId: string,
    em: EntityManager,
  ): Promise<BalancePayment> {
    const repository = em.getRepository(BalancePayment);
    const entity = await repository.findOneOrFail({
      where: {
        id: paymentId,
        status: BalancePaymentStatus.PENDING,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });
    await repository.update(
      { id: entity.id },
      { status: BalancePaymentStatus.CANCELLED },
    );
    await this.balanceHistoryCommandService.cancelBalanceTransaction(
      entity.senderBalanceHistoryId,
      em,
    );
    await this.balanceHistoryCommandService.cancelBalanceTransaction(
      entity.recipientBalanceHistoryId,
      em,
    );
    const updated = await repository.findOne({ where: { id: entity.id } });
    return updated;
  }

  async confirmBalancePayment(
    paymentId: string,
    em: EntityManager,
  ): Promise<BalancePayment> {
    const repository = em.getRepository(BalancePayment);
    const entity = await repository.findOneOrFail({
      where: {
        id: paymentId,
        status: BalancePaymentStatus.PENDING,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });
    await repository.update(
      { id: entity.id },
      { status: BalancePaymentStatus.COMPLETED },
    );
    await this.balanceHistoryCommandService.confirmBalanceTransaction(
      entity.senderBalanceHistoryId,
      em,
    );
    await this.balanceHistoryCommandService.confirmBalanceTransaction(
      entity.recipientBalanceHistoryId,
      em,
    );
    const updated = await repository.findOne({ where: { id: entity.id } });
    return updated;
  }
}
