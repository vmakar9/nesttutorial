import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.findOneBy({ email });
    if (user) {
      throw new ConflictException();
    }
  }
}
