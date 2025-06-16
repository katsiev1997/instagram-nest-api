import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Instagram API')
    .setDescription('Instagram API description')
    .setVersion('1.0.0')
    .addTag('instagram')
    .addBearerAuth()
    .build();
}
