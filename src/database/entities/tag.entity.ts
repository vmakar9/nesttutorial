import { Column, Entity, ManyToMany, VirtualColumn } from 'typeorm';
import { BaseEntity } from './models/base.entity';
import { ArticleEntity } from './article.entity';
import { TableNameEnum } from './enums/table.enum';

@Entity(TableNameEnum.TAG)
export class TagEntity extends BaseEntity {
  @Column('text')
  name: string;

  @ManyToMany(() => ArticleEntity, (entity) => entity.tags)
  articles?: ArticleEntity[];

  @VirtualColumn({ query: () => 'NULL' })
  articlesCount: number;
}
