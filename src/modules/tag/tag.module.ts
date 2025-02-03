import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './services/tag.service';

@Module({
  imports: [],
  controllers: [TagController],
  providers: [TagService],
  exports: [],
})
export class TagModule {}
