import { ArticleEntity } from '../../../database/entities/article.entity';
import { ArticleResponseDto } from '../models/dto/response/article.response.dto';
import { UserMapper } from '../../../user/services/user.mapper';

export class ArticleMapper {
  public static toResponseDto(
    articleEntity: ArticleEntity,
  ): ArticleResponseDto {
    return {
      id: articleEntity.id,
      body: articleEntity.body,
      title: articleEntity.title,
      description: articleEntity.description,
      created: articleEntity.created,
      updated: articleEntity.updated,
      user: articleEntity.user
        ? UserMapper.toResponseDto(articleEntity.user)
        : null,
    };
  }
}
