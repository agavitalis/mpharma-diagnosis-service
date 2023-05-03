import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosisController } from './diagnosis.controller';
import { DiagnosisService } from './diagnosis.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { v4 as uuidv4 } from 'uuid';

describe('DiagnosisController', () => {
  let controller: DiagnosisController;
  let service: DiagnosisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiagnosisController],
      providers: [
        {
          provide: DiagnosisService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                id: uuidv4(),
                categoryCode: 'AOO',
                diagnosisCode: '4',
                fullCode: 'A001',
                abbreviatedDescription: 'Malaria',
                fullDescription: 'Maralia Typhod',
                categoryTitle: 'Typhod',
              },
              {
                id: uuidv4(),
                categoryCode: 'AOO',
                diagnosisCode: '4',
                fullCode: 'A001',
                abbreviatedDescription: 'Malaria',
                fullDescription: 'Maralia Typhod',
                categoryTitle: 'Typhod',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                categoryCode: 'AOO',
                diagnosisCode: '4',
                fullCode: 'A001',
                abbreviatedDescription: 'Malaria',
                fullDescription: 'Maralia Typhod',
                categoryTitle: 'Typhod',
                id,
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((createDiagnosisDto: CreateDiagnosisDto) =>
                Promise.resolve({ id: 'a uuid', ...createDiagnosisDto }),
              ),
            update: jest
              .fn()
              .mockImplementation((updateDiagnosisDto: UpdateDiagnosisDto) =>
                Promise.resolve({ id: 'a uuid', ...updateDiagnosisDto }),
              ),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<DiagnosisController>(DiagnosisController);
    service = module.get<DiagnosisService>(DiagnosisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
