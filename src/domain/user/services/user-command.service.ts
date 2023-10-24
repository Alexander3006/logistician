import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { AuthStrategyManager } from 'src/infrastructure/auth/services/strategy-manager.service';
import { RegisterUserInput } from '../dto/register-user.input';
import {
  ExpiredEvent,
  RedisStorageService,
} from 'src/infrastructure/memory-storage/services/redis-storage.service';
import { EmailVerificationService } from './email-verification.service';
import { PointDTO } from 'src/domain/location/dto/point.dto';
import {
  Location,
  LocationOwner,
} from 'src/domain/location/entities/location.entity';
import { LocationCommandService } from 'src/domain/location/services/location-command.service';

@Injectable()
export class UserCommandService {
  private readonly logger: Logger = new Logger(UserCommandService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepositoty: Repository<User>,
    private readonly authStrategyManager: AuthStrategyManager,
    private readonly redisStorageService: RedisStorageService,
    private readonly locationCommandService: LocationCommandService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {
    this.redisStorageService.on(ExpiredEvent, async (key) => {
      await Promise.allSettled([this.onUnverifiedEmailExpired(key)]);
    });
  }

  async onUnverifiedEmailExpired(key: string): Promise<void> {
    const [type, email] = key.split(':');
    if (type !== 'unverified-email') return;
    await this.userRepositoty.delete({ email, isEmailVerified: false });
    return;
  }

  async register(registerUserInput: RegisterUserInput): Promise<User> {
    const userData = await this.authStrategyManager.getUserData(
      registerUserInput.strategy,
      registerUserInput,
    );
    const user = this.userRepositoty.create(userData);
    if (!user.isEmailVerified) {
      await this.redisStorageService
        .set(`unverified-email:${user.email}`, true, 3600)
        .catch((err) => this.logger.error(err));
      await this.emailVerificationService
        .requestEmailVerification(user.email)
        .catch((err) => this.logger.error(err));
    }
    return await this.userRepositoty.save(user);
  }

  async updateUserLocation(
    userId: string,
    point: PointDTO,
    em?: EntityManager,
  ): Promise<Location> {
    const location = await this.locationCommandService.saveLocation(
      userId,
      LocationOwner.USER,
      point,
      em,
    );
    return location;
  }
}
