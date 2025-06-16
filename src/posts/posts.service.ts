import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPostById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
        media: true,
        likes: true,
        comments: true,
      },
    });

    return post;
  }

  async create(createPostDto: CreatePostDto) {
    const { caption, userId, media } = createPostDto;

    const newPost = await this.prisma.post.create({
      data: {
        caption,
        userId,
      },
    });

    if (media && media.length > 0) {
      const newMedia = await this.prisma.media.createMany({
        data: media.map(({ url, type }) => ({
          url,
          type,
          postId: newPost.id,
        })),
      });
      return { message: 'Post created', post: newPost, media: newMedia };
    }

    return { message: 'Post created', post: newPost };
  }

  async getFeed(userId: string, page = 1, pageSize = 10) {
    // Получаем id пользователей, на которых подписан current user
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    // Получаем посты пользователей, на которых подписан current user
    const posts = await this.prisma.post.findMany({
      where: {
        userId: { in: followingIds },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
        media: true,
        likes: true,
        comments: true,
      },
    });

    return posts;
  }

  async getUserPosts(userId: string, page = 1, pageSize = 10) {
    const posts = await this.prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        media: true,
        likes: true,
        comments: true,
      },
    });

    return posts;
  }

  async update(id: string, userId: string, dto: UpdatePostDto) {
    const post = await this.findPostById(id);

    if (!post) {
      throw new NotAcceptableException('Post not found');
    }

    if (post.userId !== userId) {
      throw new NotAcceptableException('You can not edit this post');
    }

    const { caption, media } = dto;

    const updatedPost = await this.prisma.post.update({
      where: {
        id,
      },
      data: {
        caption,
        userId,
        media: {
          deleteMany: {},
          createMany: {
            data:
              media?.map(({ url, type }) => ({
                url,
                type,
                postId: id,
              })) || [],
          },
        },
      },
    });

    return { message: 'Post updated', post: updatedPost };
  }

  async remove(postId: string, userId: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotAcceptableException('Post not found');
    }

    if (post.userId !== userId) {
      throw new NotAcceptableException('You can not edit this post');
    }

    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return { message: 'Post deleted' };
  }
}
