import { ConflictException, Injectable } from '@nestjs/common';

import { UserRepository } from '../../modules/repository/services/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findAll(): Promise<string> {
    return `This action returns all user`;
  }

  public async findOne(id: number): Promise<string> {
    return `This action returns a #${id} user`;
  }

  public async remove(id: number): Promise<string> {
    return `This action removes a #${id} user`;
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException();
    }
  }
}
