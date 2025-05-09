import { Global, Module } from '@nestjs/common';
import { UserRepository } from './services/user.repository';
import { ArticleRepository } from './services/article.repository';
import { TagRepository } from './services/tag.repository';
import { CommentRepository } from './services/comment.repository';
import { LikeRepository } from './services/like.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { FollowRepository } from './services/follow.repository';

const repositories = [
  UserRepository,
  ArticleRepository,
  TagRepository,
  CommentRepository,
  LikeRepository,
  RefreshTokenRepository,
  FollowRepository,
];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
