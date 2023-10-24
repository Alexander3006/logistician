import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserBalanceCommandService } from 'src/domain/user/services/balance-command.service';
import { EntityManager } from 'typeorm';
import {
  OrderRequest,
  OrderRequestStatuses,
} from '../entities/order-request.entity';
import { OrderQueryService } from './order-query.service';
import { CreateOrderRequestDTO } from '../dto/create-order-request.dto';
import { Order, OrderStatuses } from '../entities/order.entity';
import {
  PaginationParamsDTO,
  SortParamsDTO,
} from 'src/common/dto/common-filter.dto';
import { AppException } from 'src/common/exceptions';
import { BalancePaymentCommandService } from 'src/domain/balance-history/services/balance-payment-command.service';
import { OrderCommandService } from './order-command.service';

export class OrderRequestCommandServiceException extends AppException {}

@Injectable()
export class OrderRequestCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly orderQueryService: OrderQueryService,
    private readonly userBalanceCommandService: UserBalanceCommandService,
    private readonly balancePaymentCommandService: BalancePaymentCommandService,
    private readonly orderCommandService: OrderCommandService,
  ) {}

  async createOrderRequest(
    userId: string,
    dto: CreateOrderRequestDTO,
    em: EntityManager,
  ): Promise<OrderRequest> {
    const repository = em.getRepository(OrderRequest);
    const {
      data: [order],
    } = await this.orderQueryService.getFilteredOrders({
      filter: {
        id: dto.orderId,
        status: OrderStatuses.CREATED,
      },
      pagination: new PaginationParamsDTO(),
      sort: new SortParamsDTO(),
    });
    if (!order)
      throw new OrderRequestCommandServiceException({
        message: `Active order not found`,
        code: 'NOT_FOUND',
        statusCode: 404,
      });
    const enought = await this.userBalanceCommandService.checkBalance(
      userId,
      order.currencyId,
      order.insuranceAmount.toString(),
      em,
    );
    if (!enought)
      throw new OrderRequestCommandServiceException({
        message: `Insufficient funds to cover the insured event`,
        code: 'INSUFFIENCE_FUNDS',
        statusCode: 402,
      });
    const entity = OrderRequest.create({ ...dto, ownerId: userId });
    const request = await repository.save(entity);
    return request;
  }

  async cancelOrderRequest(
    userId: string,
    requestId: string,
    em: EntityManager,
  ): Promise<OrderRequest> {
    const repository = em.getRepository(OrderRequest);
    const request = await repository.findOneOrFail({
      where: {
        ownerId: userId,
        id: requestId,
        // status: OrderRequestStatuses.CREATED,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });
    const {
      data: [accepted],
    } = await this.orderQueryService.getFilteredOrders({
      filter: {
        acceptedRequestId: requestId,
      },
      pagination: new PaginationParamsDTO(),
      sort: new SortParamsDTO(),
    });
    if (!!accepted) {
      await this.orderCommandService.cancelOrderByRequestOwner(
        { orderId: accepted.id },
        em,
      );
    }
    await repository.update(
      { id: request.id },
      { status: OrderRequestStatuses.CANCELLED },
    );
    const updated = await repository.findOne({ where: { id: request.id } });
    return updated;
  }

  async acceptOrderRequest(
    userId: string,
    requestId: string,
    em: EntityManager,
  ): Promise<Order> {
    const repository = em.getRepository(OrderRequest);
    // check order
    const request = await repository.findOneOrFail({
      where: {
        id: requestId,
        order: {
          ownerId: userId,
          status: OrderStatuses.CREATED,
        },
        status: OrderRequestStatuses.CREATED,
      },
      relations: ['order'],
    });
    const order = request.order;
    //lock all by car
    const carRequests = await repository.find({
      where: {
        carId: request.carId,
        status: OrderRequestStatuses.CREATED,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });
    // confirmation
    const balanceCompensation =
      await this.balancePaymentCommandService.createBalancePayment(
        {
          senderId: request.ownerId,
          recipientId: order.ownerId,
          amount: order.insuranceAmount.toString(),
          currencyId: order.currencyId,
        },
        em,
      );
    const balancePayment =
      await this.balancePaymentCommandService.createBalancePayment(
        {
          senderId: order.ownerId,
          recipientId: request.ownerId,
          amount: request.price.toString(),
          currencyId: order.currencyId,
        },
        em,
      );
    await repository.update(
      { id: request.id },
      {
        status: OrderRequestStatuses.ACCEPTED,
      },
    );
    const updated = await this.orderCommandService.acceptOrder(
      {
        orderId: order.id,
        ownerId: userId,
        balanceCompensationId: balanceCompensation.id,
        balancePaymentId: balancePayment.id,
      },
      em,
    );
    // cancel other car requests
    await repository.update(
      { carId: request.carId, status: OrderRequestStatuses.CREATED },
      { status: OrderRequestStatuses.CANCELLED },
    );
    return updated;
  }
}
