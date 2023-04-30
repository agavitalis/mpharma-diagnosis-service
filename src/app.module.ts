import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiagnosisModule } from './diagnosis/diagnosis.module';

@Module({
  imports: [DiagnosisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
