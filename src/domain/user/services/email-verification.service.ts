import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { RedisStorageService } from 'src/infrastructure/memory-storage/services/redis-storage.service';
import { Templates } from 'src/infrastructure/mail/types';
import { Locales, NotificationTransport } from 'src/domain/notification/types';
import { NotificationService } from 'src/domain/notification/services/notification.service';

export class EmailVerificationServiceError extends Error {}

@Injectable()
export class EmailVerificationService {
  private readonly ttl = 300; //5 min
  constructor(
    @InjectRepository(User)
    private readonly userRepositoty: Repository<User>,
    private readonly notificationService: NotificationService,
    private readonly redisStorageService: RedisStorageService,
  ) {}

  private generateCode(): string {
    const code = 100000 + Math.floor(Math.random() * 900000);
    return code.toString();
  }

  async requestEmailVerification(email: string): Promise<boolean> {
    const user = await this.userRepositoty.findOne({
      where: {
        email: email,
        isEmailVerified: false,
      },
    });
    if (!user)
      throw new EmailVerificationServiceError(
        `User with unverified email ${email} not found`,
      );
    const code = this.generateCode();
    const key = `email-verification:${user.email}`;
    await this.redisStorageService.set(key, code, this.ttl);
    const result = await this.notificationService.notify(
      NotificationTransport.MAIL,
      {
        event: Templates.EMAIL_VERIFICATION,
        recipients: [user.id],
        locale: Locales.EN,
        data: { code },
        indexed: false,
      },
      this.ttl,
    );
    return result;
  }

  async verifyEmail(email: string, code: string): Promise<boolean> {
    const key = `email-verification:${email}`;
    const exist = await this.redisStorageService.get(key);
    if (!exist)
      throw new EmailVerificationServiceError('Verification code not found');
    if (+exist !== +code)
      throw new EmailVerificationServiceError('Wrong verification code');
    await this.redisStorageService.del(key);
    await this.userRepositoty.update({ email }, { isEmailVerified: true });
    return true;
  }
}
