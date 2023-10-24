import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Order, OrderStatuses } from '../entities/order.entity';
import { CreateOrderDTO } from '../dto/create-order.dto';
import { UserBalanceCommandService } from 'src/domain/user/services/balance-command.service';
import { AppException } from 'src/common/exceptions';
import { BalanceHistoryCommandService } from 'src/domain/balance-history/services/balance-history-command.service';
import { BalancePaymentCommandService } from 'src/domain/balance-history/services/balance-payment-command.service';
import { OrderRequestQueryService } from './order-request-query.service';
import { LocationCommandService } from 'src/domain/location/services/location-command.service';
import { LocationOwner } from 'src/domain/location/entities/location.entity';

export class OrderCommandServiceException extends AppException {}

@Injectable()
export class OrderCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly userBalanceCommandService: UserBalanceCommandService,
    private readonly balancePaymentCommandService: BalancePaymentCommandService,
    private readonly orderRequestQueryService: OrderRequestQueryService,
    private readonly locationCommandService: LocationCommandService,
  ) {}

  async createOrder(
    userId: string,
    payload: CreateOrderDTO,
    em: EntityManager,
  ): Promise<Order> {
    const repository = em.getRepository(Order);
    const enoughtBalance = this.userBalanceCommandService.checkBalance(
      userId,
      payload.currencyId,
      payload.price.toString(),
      em,
    );
    if (!enoughtBalance)
      throw new OrderCommandServiceException({
        message: `Not enought balance to create order`,
        code: 'NOT_ENOUGHT_BALANCE',
        statusCode: 402,
      });
    const location = payload.location;
    delete payload.location;
    const entity = Order.create({
      ...payload,
      ownerId: userId,
    });
    const order = await repository.save(entity);
    if (location) {
      await this.locationCommandService.saveLocation(
        order.id,
        LocationOwner.ORDER,
        location,
        em,
      );
    }
    return order;
  }

  async cancelOrderByOwner(
    userId: string,
    orderId: string,
    em: EntityManager,
  ): Promise<Order> {
    const repository = em.getRepository(Order);
    const order = await repository.findOne({
      where: {
        id: orderId,
        ownerId: userId,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });
    if (
      [OrderStatuses.CANCELLED, OrderStatuses.CONFLICT, OrderStatuses.SUCCESS]
    )
      throw new OrderCommandServiceException({
        message: `It is impossible to cancel an order in status ${order.status}`,
        code: 'IMPOSSIBLE_OPERATION',
        statusCode: 409,
      });
    if (order.status === OrderStatuses.CREATED) {
      await repository.update(
        { id: order.id },
        { status: OrderStatuses.CANCELLED },
      );
    }
    if (order.status === OrderStatuses.ACCEPTED) {
      const request = await this.orderRequestQueryService.getOrderRequest(
        order.acceptedRequestId,
        em,
      );
      await this.balancePaymentCommandService.cancelBalancePayment(
        order.balanceCompensationId,
        em,
      );
      await this.balancePaymentCommandService.cancelBalancePayment(
        order.balancePaymentId,
        em,
      );
      const balanceCompensaction =
        await this.balancePaymentCommandService.createBalancePayment(
          {
            senderId: order.ownerId,
            recipientId: request.ownerId,
            currencyId: order.currencyId,
            amount: request.insuranceAmount.toString(),
          },
          em,
        );
      await this.balancePaymentCommandService.confirmBalancePayment(
        balanceCompensaction.id,
        em,
      );
      await repository.update(
        { id: order.id },
        {
          status: OrderStatuses.CANCELLED,
          balanceCompensationId: balanceCompensaction.id,
        },
      );
    }
    return await repository.findOne({ where: { id: orderId } });
  }

  async executeOrder(
    userId: string,
    orderId: string,
    em: EntityManager,
  ): Promise<Order> {
    const repository = em.getRepository(Order);
    const exist = await repository.findOneOrFail({
      where: {
        id: orderId,
        ownerId: userId,
        status: OrderStatuses.ACCEPTED,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });
    await this.balancePaymentCommandService.cancelBalancePayment(
      exist.balanceCompensationId,
      em,
    );
    await this.balancePaymentCommandService.confirmBalancePayment(
      exist.balancePaymentId,
      em,
    );
    await repository.update(
      { id: exist.id },
      { status: OrderStatuses.SUCCESS },
    );
    const order = await repository.findOne({ where: { id: exist.id } });
    return order;
  }

  async cancelOrderByRequestOwner(
    dto: {
      orderId: string;
    },
    em: EntityManager,
  ): Promise<Order> {
    const repository = em.getRepository(Order);
    const exist = await repository.findOneOrFail({
      where: {
        id: dto.orderId,
        status: OrderStatuses.ACCEPTED,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });
    await this.balancePaymentCommandService.cancelBalancePayment(
      exist.balancePaymentId,
      em,
    );
    await this.balancePaymentCommandService.confirmBalancePayment(
      exist.balanceCompensationId,
      em,
    );
    await repository.update(
      { id: exist.id },
      { status: OrderStatuses.CANCELLED },
    );
    const order = await repository.findOne({ where: { id: exist.id } });
    return order;
  }

  async acceptOrder(
    dto: {
      orderId: string;
      ownerId: string;
      balanceCompensationId: string;
      balancePaymentId: string;
    },
    em: EntityManager,
  ): Promise<Order> {
    const repository = em.getRepository(Order);
    const exist = await repository.findOneOrFail({
      where: {
        id: dto.orderId,
        ownerId: dto.ownerId,
        status: OrderStatuses.CREATED,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });
    await repository.update(
      { id: exist.id },
      {
        balanceCompensationId: dto.balanceCompensationId,
        balancePaymentId: dto.balancePaymentId,
        status: OrderStatuses.ACCEPTED,
      },
    );
    const order = await repository.findOne({ where: { id: exist.id } });
    return order;
  }
}
