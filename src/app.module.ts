import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: config.DB_PORT || 5432,
      username: config.DB_USERNAME || 'admin',
      password: config.DB_PASSWORD || '12345',
      database: config.DB_NAME || 'postgres',
      ssl: false,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: config.IS_DEVELOPMENT ? true : false,
      autoLoadEntities: true,
    }),
    DiagnosisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
