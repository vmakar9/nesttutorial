import {
  Controller,
  Get,
  Param,
  Delete,
  Put,
  Body,
  ParseUUIDPipe,
  Post,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './services/user.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserResponseDto } from './models/dto/response/user.response.dto';
import { CurrentUser } from '../modules/auth/decorators/current-user.decorator';
import { IUserData } from '../modules/auth/interfaces/user-data.interface';
import { UpdateUserRequestDto } from './models/dto/request/update-user.request.dto';
import { SkipAuth } from '../modules/auth/decorators/skip-auth.decorator';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async findAll(): Promise<string> {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @Get('me')
  public async findMy(
    @CurrentUser() userData: IUserData,
  ): Promise<UserResponseDto> {
    return await this.userService.findMe(userData);
  }

  @SkipAuth()
  @Get(':id')
  public async getPublicUser(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<UserResponseDto> {
    return await this.userService.getPublicUser(userId);
  }

  @ApiBearerAuth()
  @Put('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateMe(userData, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Post(':userId/follow')
  public async follow(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.userService.follow(userId, userData);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @Delete(':userId/follow')
  public async unfollow(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.userService.unfollow(userId, userData);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<string> {
    return await this.userService.remove(+id);
  }
}
