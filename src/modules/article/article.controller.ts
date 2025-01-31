import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ArticleService } from './services/article.service';
import { ArticleResponseDto } from './models/dto/response/article.response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CreateArticleRequestDto } from './models/dto/request/create-article.request.dto';
import { EditArticleRequestDto } from './models/dto/request/edit-article.request.dto';
import { ArticleListRequestDto } from './models/dto/request/article-list.request.dto';
import { ArticleListResponseDto } from './models/dto/response/article-list.response.dto';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiBearerAuth()
  @Get()
  public async getList(
    @Query() query: ArticleListRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<ArticleListResponseDto> {
    return await this.articleService.getList(query, userData);
  }

  @ApiBearerAuth()
  @Put()
  public async create(
    @Body() dto: CreateArticleRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<ArticleResponseDto> {
    return await this.articleService.create(dto, userData);
  }

  @ApiBearerAuth()
  @Get(':articleId')
  public async getArticleById(
    @Param('articleId', ParseUUIDPipe) articleId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<ArticleResponseDto> {
    return await this.articleService.getArticleById(articleId, userData);
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @Post(':articleId/like')
  public async like(
    @Param('articleId', ParseUUIDPipe) articleId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    return await this.articleService.like(articleId, userData);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @Delete(':articleId/like')
  public async dislike(
    @Param('articleId', ParseUUIDPipe) articleId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.articleService.dislike(articleId, userData);
  }
}
