import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Config, JWTConfig } from '../../../config/config.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload.type';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import { TokenType } from '../enums/token-type.enum';

@Injectable()
export class TokenService {
  private jwtConfig: JWTConfig;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get<JWTConfig>('jwt');
  }

  public async generateAuthTokens(
    payload: JwtPayload,
  ): Promise<TokenResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload, TokenType.ACCESS),
      this.generateToken(payload, TokenType.REFRESH),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async verifyToken(
    token: string,
    type: TokenType,
  ): Promise<JwtPayload> {
    try {
      const secret = this.getSecret(type);

      return await this.jwtService.verifyAsync(token, { secret });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async generateToken(
    payload: JwtPayload,
    type: TokenType,
  ): Promise<string> {
    const secret = this.getSecret(type);
    const expiresIn = this.getExpiresIn(type);

    return await this.jwtService.signAsync(payload, { expiresIn, secret });
  }

  private getSecret(type: TokenType): string {
    switch (type) {
      case TokenType.ACCESS:
        return this.jwtConfig.accessTokenSecret;
      case TokenType.REFRESH:
        return this.jwtConfig.refreshTokenSecret;
    }
  }

  private getExpiresIn(type: TokenType): number {
    switch (type) {
      case TokenType.ACCESS:
        return this.jwtConfig.accessTokenExpiration;
      case TokenType.REFRESH:
        return this.jwtConfig.refreshTokenExpiration;
    }
  }
}
