import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { HealthModule } from './health/health.module';
import configuration from '../config/config';
import { PostgresModule } from './postgres/postgres.module';
import { RepositoryModule } from './repository/repository.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    PostgresModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ArticleModule,
    TagModule,
    HealthModule,
    RepositoryModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
