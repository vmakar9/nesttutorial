import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { UserModule } from './user/user.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [UserModule, HealthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
