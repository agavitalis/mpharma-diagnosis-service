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
      // url: config.DB_URL,
      // ssl: {
      //   rejectUnauthorized: false,
      // },
      host: 'postgres',
      port: 5432,
      username: 'admin',
      password: '12345',
      database: 'postgres',
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
