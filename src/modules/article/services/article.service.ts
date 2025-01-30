import { ArticleRepository } from '../../repository/services/article.repository';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { ArticleResponseDto } from '../models/dto/response/article.response.dto';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CreateArticleRequestDto } from '../models/dto/request/create-article.request.dto';
import { ArticleMapper } from './article.mapper';
import { ArticleEntity } from '../../../database/entities/article.entity';
import { EditArticleRequestDto } from '../models/dto/request/edit-article.request.dto';
import { ArticleListRequestDto } from '../models/dto/request/article-list.request.dto';
@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  public async getList(query: ArticleListRequestDto): Promise<any> {
    const qb = this.articleRepository.createQueryBuilder('article');
    qb.addOrderBy('article.created', 'DESC');
    qb.take(10);
    qb.skip(0);
    const [entities, total] = await qb.getManyAndCount();
    return { entities, total };
  }

  public async create(
    dto: CreateArticleRequestDto,
    userData: IUserData,
  ): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.save(
      this.articleRepository.create({ ...dto, user_id: userData.userId }),
    );
    return ArticleMapper.toResponseDto(article);
  }

  public async getArticleById(articleId: string): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
      relations: { user: true },
    });
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
}
