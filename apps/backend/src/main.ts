import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PendingGameExceptionFilter } from '@/common/http/filters/pending-game-exception.filter';
import { UserExceptionFilter } from '@/common/http/filters/user-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Tri Smeni Game API')
      .setDescription('API for backend')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    document.tags = [
      {
        name: 'Auth',
        description: 'Authentication, password reset, user data etc',
      },
      {
        name: 'PendingGame',
        description: 'Pending Games create, join, add, read etc',
      },
      { name: 'Organizations', description: 'Organizations' },
      { name: 'Games', description: 'Games' },
    ];

    SwaggerModule.setup('api/docs', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(
    new PendingGameExceptionFilter(),
    new UserExceptionFilter(),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server started on port ${port}`);
}
bootstrap();
