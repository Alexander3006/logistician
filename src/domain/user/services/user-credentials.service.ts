import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthStrategyManager } from 'src/infrastructure/auth/services/strategy-manager.service';
import { RedisStorageService } from 'src/infrastructure/memory-storage/services/redis-storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePasswordInput } from '../dto/update-password.input';
import { StrategyTypes } from 'src/infrastructure/auth/interfaces/strategy-service.interface';
import { TwoFactorAuthenticationService } from 'src/infrastructure/auth/services/two-factor-auth.service';
import { TwoFASecret } from '../dto/two-fa-secret.dto';
import { Templates } from 'src/infrastructure/mail/types';
import { NotificationService } from 'src/domain/notification/services/notification.service';
import { Locales, NotificationTransport } from 'src/domain/notification/types';

export class UserCredentialsServiceError extends Error {}

@Injectable()
export class UserCredentialsService {
  private readonly logger: Logger = new Logger(UserCredentialsService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepositoty: Repository<User>,
    private readonly authStrategyManager: AuthStrategyManager,
    private readonly notificationService: NotificationService,
    private readonly redisStorageService: RedisStorageService,
    private readonly twoFAService: TwoFactorAuthenticationService,
  ) {}

  private generateCode(): string {
    const code = 100000 + Math.floor(Math.random() * 900000);
    return code.toString();
  }

  async updatePasswordByOldPassword(
    payload: UpdatePasswordInput,
  ): Promise<boolean> {
    const { email, password, oldPassword } = payload;
    const user = await this.userRepositoty.findOne({
      where: {
        email: email,
        isEmailVerified: true,
      },
    });
    if (!user)
      throw new UserCredentialsServiceError(
        `User with verified email ${email} not found`,
      );
    const validOldPassword = await this.authStrategyManager.verifyUser(
      StrategyTypes.LOCAL,
      user,
      { email, password: oldPassword },
    );
    if (!validOldPassword)
      throw new UserCredentialsServiceError(`Invalid old password`);
    const { password: newPasswordHash } =
      await this.authStrategyManager.getUserData(StrategyTypes.LOCAL, {
        email,
        password,
      });
    await this.userRepositoty.update({ email }, { password: newPasswordHash });
    return true;
  }

  async updatePasswordByCode(payload: UpdatePasswordInput): Promise<true> {
    const { email, password, code } = payload;
    const user = await this.userRepositoty.findOne({
      where: {
        email: email,
        isEmailVerified: true,
      },
    });
    if (!user)
      throw new UserCredentialsServiceError(
        `User with verified email ${email} not found`,
      );
    const key = `update-password-code:${email}`;
    const exist = await this.redisStorageService.get(key);
    if (!exist) throw new UserCredentialsServiceError('Code not found');
    if (+exist !== +code) throw new UserCredentialsServiceError('Wrong code');
    const { password: newPasswordHash } =
      await this.authStrategyManager.getUserData(StrategyTypes.LOCAL, {
        email,
        password,
      });
    await this.redisStorageService.del(key);
    await this.userRepositoty.update({ email }, { password: newPasswordHash });
    return true;
  }

  async updatePasswordCodeRequest(email: string): Promise<boolean> {
    const user = await this.userRepositoty.findOne({
      where: {
        email: email,
        isEmailVerified: true,
      },
    });
    if (!user)
      throw new UserCredentialsServiceError(
        `User with verified email ${email} not found`,
      );
    const code = this.generateCode();
    const key = `update-password-code:${email}`;
    await this.redisStorageService.set(key, code, 600);
    const result = await this.notificationService.notify(
      NotificationTransport.MAIL,
      {
        recipients: [user.id],
        locale: Locales.EN,
        event: Templates.UPDATE_PASSWORD_CODE,
        data: { code },
        indexed: false,
      },
      600,
    );
    return result;
  }

  //2FA
  async generateTwoFASecret(
    userId: string,
    force: boolean = false,
  ): Promise<TwoFASecret> {
    const user = await this.userRepositoty.findOne({
      where: { id: userId, isTwoFAEnabled: false },
    });
    if (!user)
      throw new UserCredentialsServiceError('User with disabled 2fa not found');
    if (!user.password?.length)
      throw new UserCredentialsServiceError('Local strategy disabled');
    if (!user.twoFASecret?.length && !force)
      throw new UserCredentialsServiceError(
        'No pre-generated secret, use force: true',
      );
    const twoFASecret = await this.twoFAService.generateSecret(
      user.email,
      force ? null : user.twoFASecret,
    );
    await this.userRepositoty.update(
      { id: userId },
      { twoFASecret: twoFASecret.secret },
    );
    return twoFASecret;
  }

  async getTwoFASecret(userId: string): Promise<TwoFASecret> {
    const user = await this.userRepositoty.findOne({ where: { id: userId } });
    if (!user)
      throw new UserCredentialsServiceError('User with disabled 2fa not found');
    if (!user.password?.length)
      throw new UserCredentialsServiceError('Local strategy disabled');
    if (!user.twoFASecret?.length)
      throw new UserCredentialsServiceError('No pre-generated secret');
    const twoFASecret = await this.twoFAService.generateSecret(
      user.email,
      user.twoFASecret,
    );
    return twoFASecret;
  }

  async turnOnTwoFA(userId: string, code: string): Promise<boolean> {
    const user = await this.userRepositoty.findOne({
      where: { id: userId, isTwoFAEnabled: false },
    });
    if (!user)
      throw new UserCredentialsServiceError('User with disabled 2fa not found');
    if (!user.password?.length)
      throw new UserCredentialsServiceError('Local strategy disabled');
    if (!user.twoFASecret?.length)
      throw new UserCredentialsServiceError('No pre-generated secret');
    const validCode = await this.twoFAService.verifyCode(
      code,
      user.twoFASecret,
    );
    if (!validCode) throw new UserCredentialsServiceError('Wrong 2fa code');
    await this.userRepositoty.update({ id: userId }, { isTwoFAEnabled: true });
    return true;
  }

  async turnOffTwoFA(userId: string, code: string): Promise<boolean> {
    const user = await this.userRepositoty.findOne({
      where: { id: userId, isTwoFAEnabled: true },
    });
    if (!user)
      throw new UserCredentialsServiceError('User with enabled 2fa not found');
    if (!user.password?.length)
      throw new UserCredentialsServiceError('Local strategy disabled');
    if (!user.twoFASecret?.length)
      throw new UserCredentialsServiceError('No pre-generated secret');
    const validCode = await this.twoFAService.verifyCode(
      code,
      user.twoFASecret,
    );
    if (!validCode) throw new UserCredentialsServiceError('Wrong 2fa code');
    await this.userRepositoty.update({ id: userId }, { isTwoFAEnabled: false });
    return true;
  }
}
