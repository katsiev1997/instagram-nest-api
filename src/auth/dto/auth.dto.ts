import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    description: 'JWT access token',
    example: 'adskga;dljsgnkldsj;klgjlkj3w',
  })
  accessToken: string;
}
