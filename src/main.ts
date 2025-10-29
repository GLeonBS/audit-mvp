import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ContextMiddleware } from './context.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new ContextMiddleware().use);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
