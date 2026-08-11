import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PendingGameExceptionFilter } from '@/common/http/filters/pending-game-exception.filter';
import { UserExceptionFilter } from '@/common/http/filters/user-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
