import { DataSource, Repository } from 'typeorm';
import { ArticleEntity } from '../../../database/entities/article.entity';
import { Injectable } from '@nestjs/common';
import { ArticleListRequestDto } from '../../article/models/dto/request/article-list.request.dto';
import { IUserData } from '../../auth/interfaces/user-data.interface';

@Injectable()
export class ArticleRepository extends Repository<ArticleEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ArticleEntity, dataSource.manager);
  }

  public async getList(
    query: ArticleListRequestDto,
    userData: IUserData,
  ): Promise<[ArticleEntity[], number]> {
    const qb = this.createQueryBuilder('article');
    qb.leftJoinAndSelect('article.likes', 'like', 'like.user_id = :myId');
    qb.leftJoinAndSelect('article.user', 'user');
    qb.leftJoinAndSelect('article.tags', 'tag');
    qb.leftJoinAndSelect(
      'user.followings',
      'follow',
      'follow.following_id = :myId',
    );
    if (query.tag) {
      qb.andWhere('tag.name = :tag');
      qb.setParameter('tag', query.tag);
    }
    if (query.search) {
      qb.andWhere(
        'CONCAT(LOWER(article.title), LOWER(article.description)) LIKE :search',
      );
      qb.setParameter('search', `%${query.search}%`);
    }

    qb.setParameter('myId', userData.userId);
    qb.addOrderBy('article.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);
    return await qb.getManyAndCount();
  }

  public async getArticleById(
    articleId: string,
    userData: IUserData,
  ): Promise<ArticleEntity> {
    const qb = this.createQueryBuilder('article');
    qb.leftJoinAndSelect('article.likes', 'like', 'like.user_id = :myId');
    qb.leftJoinAndSelect('article.user', 'user');
    qb.leftJoinAndSelect('article.tags', 'tag');
    qb.leftJoinAndSelect(
      'user.followings',
      'follow',
      'follow.following_id = :myId',
      { myId: userData.userId },
    );
    qb.where('article.id = :articleId', { articleId });
    //qb.setParameter('articleId', articleId);
    return await qb.getOne();
  }
}
