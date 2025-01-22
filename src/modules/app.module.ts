import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { HealthModule } from './health/health.module';
import configuration from '../config/config';
import { PostgresModule } from './postgres/postgres.module';
import { RepositoryModule } from './repository/repository.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PostgresModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    HealthModule,
    RepositoryModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
