import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerHelper } from './common/helpers/swagger.helper';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Api')
    .setDescription('nest tutorial')
    .setVersion('1.0')
    .addTag('nest tutorial')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerHelper.setDefaultResponses(document);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelExpandDepth: 3,
      persistAuthorization: true,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
