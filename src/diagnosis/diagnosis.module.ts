import { Module } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { DiagnosisController } from './diagnosis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnosis } from './entities/diagnosis.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diagnosis]),
    ClientsModule.register([
      {
        name: config.RABBITMQ_NOTIFICATION_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [config.RABBITMQ_URL],
          queue: config.RABBITMQ_NOTIFICATION_QUEUE,
          queueOptions: {
            durable: false,
          },
          noAck: false,
        },
      },
    ]),
  ],
  controllers: [DiagnosisController],
  providers: [DiagnosisService],
})
export class DiagnosisModule {}
