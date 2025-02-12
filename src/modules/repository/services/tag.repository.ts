import { DataSource, Repository } from 'typeorm';
import { TagEntity } from '../../../database/entities/tag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagRepository extends Repository<TagEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(TagEntity, dataSource.manager);
  }

  public async getPopular(): Promise<TagEntity[]> {
    const qb = this.createQueryBuilder('tag');
    qb.leftJoin('tag.articles', 'article');
    qb.addSelect('COUNT(article.id)', 'tag_articleCount');
    qb.groupBy('tag.id');
    qb.orderBy('"tag_articlesCount"', 'DESC');
    qb.limit(10);
    return await qb.getMany();
  }
}
