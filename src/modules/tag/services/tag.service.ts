import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../repository/services/tag.repository';
import { TagResponseDto } from '../models/response/tag.response';
import { TagMapper } from './tag.mapper';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  public async getPopular(): Promise<TagResponseDto[]> {
    const tags = await this.tagRepository.getPopular();
    return TagMapper.toListResponseDto(tags);
  }
}
