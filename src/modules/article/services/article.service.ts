import { ArticleRepository } from '../../repository/services/article.repository';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { ArticleResponseDto } from '../models/dto/response/article.response.dto';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CreateArticleRequestDto } from '../models/dto/request/create-article.request.dto';
import { ArticleMapper } from './article.mapper';
import { ArticleEntity } from '../../../database/entities/article.entity';
import { EditArticleRequestDto } from '../models/dto/request/edit-article.request.dto';
import { ArticleListRequestDto } from '../models/dto/request/article-list.request.dto';
import { ArticleListResponseDto } from '../models/dto/response/article-list.response.dto';
import { LikeRepository } from '../../repository/services/like.repository';
import { TagEntity } from 'src/database/entities/tag.entity';
import { TagRepository } from '../../repository/services/tag.repository';
import { In } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly articleRepository: ArticleRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  public async getList(
    query: ArticleListRequestDto,
    userData: IUserData,
  ): Promise<ArticleListResponseDto> {
    const [entities, total] = await this.articleRepository.getList(
      query,
      userData,
    );

    return ArticleMapper.toListResponseDto(entities, total, query);
  }

  public async create(
    dto: CreateArticleRequestDto,
    userData: IUserData,
  ): Promise<ArticleResponseDto> {
    const tags = await this.createTagsForArticle(dto.tags);
    const article = await this.articleRepository.save(
      this.articleRepository.create({
        ...dto,
        user_id: userData.userId,
        tags: tags,
      }),
    );
    return ArticleMapper.toResponseDto(article);
  }

  public async getArticleById(
    articleId: string,
    userData: IUserData,
  ): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.getArticleById(
      articleId,
      userData,
    );
    if (!article) {
      throw new UnprocessableEntityException();
    }
    return ArticleMapper.toResponseDto(article);
  }

  public async editArticleById(
    articleId: string,
    userData: IUserData,
    dto: EditArticleRequestDto,
  ): Promise<ArticleResponseDto> {
    const article = await this.findOneByIdOrThrow(articleId, userData.userId);
    const new_article = await this.articleRepository.save(
      this.articleRepository.merge(article, dto),
    );
    return ArticleMapper.toResponseDto(new_article);
  }

  public async deleteArticleById(
    articleId: string,
    userData: IUserData,
  ): Promise<void> {
    const article = await this.findOneByIdOrThrow(articleId, userData.userId);
    await this.articleRepository.remove(article);
  }

  private async findOneByIdOrThrow(
    articleId: string,
    userId: string,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneBy({
      id: articleId,
      user_id: userId,
    });
    if (!article) {
      throw new UnprocessableEntityException();
    }
    return article;
  }

  public async like(articleId: string, userData: IUserData): Promise<void> {
    const article = await this.articleRepository.findOneBy({ id: articleId });
    if (article.user_id === userData.userId) {
      throw new ForbiddenException('You cant like your article');
    }
    const like = await this.likeRepository.findOneBy({
      user_id: userData.userId,
      article_id: article.id,
    });
    if (like) {
      throw new ForbiddenException('You already like this article');
    }

    await this.likeRepository.save(
      this.likeRepository.create({
        user_id: userData.userId,
        article_id: articleId,
      }),
    );
  }

  public async dislike(articleId: string, userData: IUserData): Promise<void> {
    const article = await this.articleRepository.findOneBy({ id: articleId });

    const like = await this.likeRepository.findOneBy({
      user_id: userData.userId,
      article_id: article.id,
    });
    if (!like) {
      throw new ConflictException('You cant dislike this article');
    }

    await this.likeRepository.remove(like);
  }

  public async createTagsForArticle(tags: string[]): Promise<TagEntity[]> {
    if (!tags.length) return [];
    const tagEntities = await this.tagRepository.findBy({
      name: In(tags),
    });
    const tagNamesFromDB = new Set(tagEntities.map(({ name }) => name));
    const newTagNames = tags.filter((tag) => !tagNamesFromDB.has(tag));

    const newEnities = await this.tagRepository.save(
      newTagNames.map((name) => this.tagRepository.create({ name })),
    );
    return [...tagEntities, ...newEnities];
  }
}
