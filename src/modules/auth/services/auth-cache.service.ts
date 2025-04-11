import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisService } from '../../redis/redis.service';
import { ACTIVATE_CACHE, AUTH_CACHE } from '../constants/constants';

import { Config, JWTConfig } from '../../../config/config.type';

@Injectable()
export class AuthCacheService {
  private jwtConfig: JWTConfig;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get<JWTConfig>('jwt');
  }

  public async saveToken(
    userId: string,
    deviceId: string,
    accessToken: string,
  ): Promise<void> {
    const key = `${AUTH_CACHE.ACCESS_TOKEN}:${userId}:${deviceId}`;

    await this.redisService.deleteByKey(key);
    await this.redisService.addOneToSet(key, accessToken);
    await this.redisService.expire(key, this.jwtConfig.accessTokenExpiration);
  }

  public async removeToken(userId: string, deviceId: string): Promise<void> {
    await this.redisService.deleteByKey(
      `${AUTH_CACHE.ACCESS_TOKEN}:${userId}:${deviceId}`,
    );
  }

  public async isAccessTokenExist(
    userId: string,
    deviceId: string,
    accessToken: string,
  ): Promise<boolean> {
    const userAccessTokens = await this.redisService.sMembers(
      `${AUTH_CACHE.ACCESS_TOKEN}:${userId}:${deviceId}`,
    );
    return userAccessTokens.some((token: string) => token === accessToken);
  }

  public async saveActivateToken(
    userId: string,
    activateToken: string,
  ): Promise<void> {
    const key = `${ACTIVATE_CACHE.ACTIVATE_TOKEN}:${userId}`;

    await this.redisService.deleteByKey(key);
    await this.redisService.addOneToSet(key, activateToken);
    await this.redisService.expire(
      key,
      this.jwtConfig.activationTokenExpiration,
    );
  }
}
