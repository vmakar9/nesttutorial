import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { AuthService } from './services/auth.service';
import { AuthCacheService } from './services/auth-cache.service';
import { TokenService } from './services/token.service';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [AuthController],
  imports: [JwtModule, RedisModule, MailModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    AuthService,
    AuthCacheService,
    TokenService,
  ],
  exports: [AuthCacheService],
})
export class AuthModule {}
