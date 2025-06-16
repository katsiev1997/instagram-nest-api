import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ description: 'username', example: 'mikail_katsiev' })
  @IsString({ message: 'Username should be a string' })
  @IsNotEmpty({ message: 'Username should not be empty' })
  @MaxLength(50, { message: 'Username should not be more than 30 characters' })
  username: string;

  @ApiProperty({ description: 'password', example: '123456' })
  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password should be at least 8 characters' })
  @MaxLength(128, {
    message: 'Password should not be more than 128 characters',
  })
  password: string;
}
