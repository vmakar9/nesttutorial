import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FollowEntity } from '../../../database/entities/follow.entity';

@Injectable()
export class FollowRepository extends Repository<FollowEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(FollowEntity, dataSource.manager);
  }
}
