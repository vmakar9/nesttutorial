import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './models/base.entity';
import { UserEntity } from './user.entity';
import { LikeEntity } from './like.entity';
import { CommentEntity } from './comment.entity';
import { TagEntity } from './tag.entity';
import { TableNameEnum } from './enums/table.enum';

@Entity(TableNameEnum.ARTICLES)
export class ArticleEntity extends BaseEntity {
  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  body: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.articles)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => LikeEntity, (entity) => entity.article)
  likes?: LikeEntity[];

  @OneToMany(() => CommentEntity, (entity) => entity.article)
  comments?: CommentEntity[];

  @ManyToMany(() => TagEntity, (entity) => entity.articles)
  @JoinTable()
  tags?: TagEntity[];
}
