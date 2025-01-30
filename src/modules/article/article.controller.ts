import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ArticleService } from './services/article.service';
import { ArticleResponseDto } from './models/dto/response/article.response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CreateArticleRequestDto } from './models/dto/request/create-article.request.dto';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { EditArticleRequestDto } from './models/dto/request/edit-article.request.dto';
import { ArticleListRequestDto } from './models/dto/request/article-list.request.dto';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @SkipAuth()
  @Get()
  public async getList(
    @Query() query: ArticleListRequestDto,
  ): Promise<ArticleResponseDto> {
    return await this.articleService.getList(query);
  }

  @ApiBearerAuth()
  @Put()
  public async create(
    @Body() dto: CreateArticleRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<ArticleResponseDto> {
    return await this.articleService.create(dto, userData);
  }

  @SkipAuth()
  @Get(':articleId')
  public async getArticleById(
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ): Promise<ArticleResponseDto> {
    return await this.articleService.getArticleById(articleId);
  }

  @ApiBearerAuth()
  @Put(':articleId')
  public async editArticleById(
    @Param('articleId', ParseUUIDPipe) articleId: string,
    @Body() dto: EditArticleRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<ArticleResponseDto> {
    return await this.articleService.editArticleById(articleId, userData, dto);
  }

  @ApiBearerAuth()
  @Delete(':articleId')
  public async deleteArticleById(
    @Param('articleId', ParseUUIDPipe) articleId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.articleService.deleteArticleById(articleId, userData);
  }
}
