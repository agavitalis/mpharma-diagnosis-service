import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = config.PORT || 5005;

  app.enableCors({
    credentials: true,
  });
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('mPharma Diagnosis Service')
    .setDescription('mPharma Diagnosis Service API Docs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, swaggerDocument);

  //apply validation pipe
  app.useGlobalPipes(new ValidationPipe());
  // Server Listening on port
  await app.listen(PORT);
  console.log(
    'mPharma Diagnosis Service on PORT:' +
      PORT +
      ' accessible on: http://localhost:' +
      PORT,
  );
}
bootstrap();
