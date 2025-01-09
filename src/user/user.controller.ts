import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './services/user.service';

import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CacheCustom } from '../common/decorators/cache-method.decorator';
import { UserResponseDto } from './models/dto/response/user.response.dto';
import { CreateUserDto } from './models/dto/request/create-user.dto';
import { UpdateUserDto } from './models/dto/request/update-user.dto';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiForbiddenResponse({ description: 'forbidden' })
  @ApiConflictResponse({ description: 'conflict' })
  @Post()
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  public async findAll(): Promise<string> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @CacheCustom(5000)
  public async findOne(@Param('id') id: string): Promise<string> {
    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<string> {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<string> {
    return await this.userService.remove(+id);
  }
}
