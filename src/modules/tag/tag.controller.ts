import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { TagService } from './services/tag.service';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { TagResponseDto } from './models/response/tag.response';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @SkipAuth()
  @Get('popular')
  public async getPopular(): Promise<TagResponseDto[]> {
    return await this.tagService.getPopular();
  }
}
