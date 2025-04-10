import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { SignUpRequestDto } from './dto/request/siqn-up.request.dto';
import { AuthUserResponseDto } from './dto/response/auth-user.response.dto';
import { SignInRequestDto } from './dto/request/siqn-in.request.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { IUserData } from './interfaces/user-data.interface';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { TokenResponseDto } from './dto/response/token.response.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Registration' })
  @Post('sign-up')
  public async signUp(
    @Body() dto: SignUpRequestDto,
  ): Promise<AuthUserResponseDto> {
    return await this.authService.signUp(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Login' })
  @Post('sign-in')
  public async signIn(
    @Body() dto: SignInRequestDto,
  ): Promise<AuthUserResponseDto> {
    return await this.authService.signIn(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  public async logout(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.logout(userData);
  }

  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Update token pair' })
  @Post('refresh')
  public async updateRefreshToken(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenResponseDto> {
    return await this.authService.refreshToken(userData);
  }

  @SkipAuth()
  @Patch('activate/:token')
  public async activateAccount(@Param('token') token: string): Promise<void> {
    await this.authService.activateAccount(token);
  }
}
