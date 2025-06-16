/* eslint-disable @typescript-eslint/no-unsafe-call */
import { MediaType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested, IsEnum } from 'class-validator';

class MediaItemDto {
  @IsString()
  url: string;

  @IsEnum(MediaType)
  type: MediaType;
}

export class CreatePostDto {
  @IsString()
  caption: string;

  @IsString()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  media: MediaItemDto[];
}
