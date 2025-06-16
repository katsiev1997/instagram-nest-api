import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Authorizated } from 'src/auth/decorators/authorizated.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Authorization()
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Authorizated('id') userId: string,
  ) {
    return this.postsService.create({ ...createPostDto, userId });
  }

  @Get(':id')
  findPostById(@Param('id') id: string) {
    return this.postsService.findPostById(id);
  }

  @Get()
  getFeed(
    @Authorizated('id') userId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.postsService.getFeed(userId, page, pageSize);
  }

  @Get('user/:id')
  getUserPosts(@Param('id') id: string) {
    return this.postsService.getUserPosts(id);
  }

  @Authorization()
  @Put(':id')
  update(
    @Param('id') id: string,
    @Authorizated('id') userId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, userId, dto);
  }

  @Authorization()
  @Delete(':id')
  remove(@Param('id') id: string, @Authorizated('id') userId: string) {
    return this.postsService.remove(id, userId);
  }
}
