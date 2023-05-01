import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { Diagnosis } from './entities/diagnosis.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { formatString } from 'src/config/util';
import { config } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DiagnosisService {
  constructor(
    @InjectRepository(Diagnosis)
    private readonly diagnosisRepository: Repository<Diagnosis>,
    @Inject(config.RABBITMQ_NOTIFICATION_CLIENT)
    private notificationServiceClient: ClientProxy,
  ) {}

  async create(createDiagnosisDto: CreateDiagnosisDto) {
    const diagnosis = new Diagnosis();
    diagnosis.id = uuidv4();
    diagnosis.categoryCode = createDiagnosisDto.categoryCode;
    diagnosis.diagnosisCode = createDiagnosisDto.diagnosisCode;
    diagnosis.fullCode = createDiagnosisDto.fullCode;
    diagnosis.abbreviatedDescription =
      createDiagnosisDto.abbreviatedDescription;
    diagnosis.fullDescription = createDiagnosisDto.fullDescription;
    diagnosis.categoryTitle = createDiagnosisDto.categoryTitle;

    return await this.diagnosisRepository.save(diagnosis);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Diagnosis>> {
    return paginate<Diagnosis>(this.diagnosisRepository, options);
  }

  async findOne(diagnosisId: string) {
    const diagnosis = await this.diagnosisRepository.findOne({
      where: { id: diagnosisId },
    });

    if (!diagnosis) {
      throw new HttpException(
        `Diagnosis with id: ${diagnosisId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return diagnosis;
  }

  async upload(file: Express.Multer.File) {
    const importedData = file.buffer.toString().split('\n');
    try {
      await Promise.all(
        importedData.map(async (record) => {
          const recordArray = record
            .replace(/"(.*?)"/g, (str) => str.replaceAll(',', '###COMMA###'))
            .split(',');

          await this.create({
            categoryCode: formatString(recordArray[0]),
            diagnosisCode: formatString(recordArray[1]),
            fullCode: formatString(recordArray[2]),
            abbreviatedDescription: formatString(recordArray[3]),
            fullDescription: formatString(recordArray[4]),
            categoryTitle: formatString(recordArray[5]),
          });
        }),
      );

      //send out event to notificaton services
      this.notificationServiceClient.emit(
        'diagnosis-uploaded',
        'upload-success',
      );
      return HttpStatus.ACCEPTED;
    } catch (error) {
      this.notificationServiceClient.emit(
        'diagnosis-uploaded',
        'upload-failure',
      );

      throw new HttpException(
        `Diagnosis processing failed with error: ${error.message}`,
        HttpStatus.AMBIGUOUS,
      );
    }
  }

  async update(updateDiagnosisDto: UpdateDiagnosisDto) {
    const diagnosis = await this.findOne(updateDiagnosisDto.diagnosisId);
    const updatedDiagnosis = Object.assign(diagnosis, updateDiagnosisDto);
    return await this.diagnosisRepository.save(updatedDiagnosis);
  }

  async remove(diagnosisId: string) {
    const diagnosis = await this.findOne(diagnosisId);
    await this.diagnosisRepository.remove(diagnosis);
    return diagnosis;
  }
}
