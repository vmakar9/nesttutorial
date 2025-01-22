import { UserEntity } from '../../../database/entities/user.entity';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import { AuthUserResponseDto } from '../dto/response/auth-user.response.dto';
import { UserMapper } from '../../../user/services/user.mapper';

export class AuthMapper {
  public static toResponseDto(
    userEntity: UserEntity,
    tokens: TokenResponseDto,
  ): AuthUserResponseDto {
    return {
      user: UserMapper.toResponseDto(userEntity),
      tokens,
    };
  }
}
