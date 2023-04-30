import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Diagnosis } from './entities/diagnosis.entity';
import { UploadDiagnosisDto } from './dto/upload-diagnosis.dto';

@ApiTags('Diagnosis')
@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post()
  async create(@Body() createDiagnosisDto: CreateDiagnosisDto) {
    return await this.diagnosisService.create(createDiagnosisDto);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() uploadDiagnosisDto: UploadDiagnosisDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'csv',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
  ) {
    const importedData = file.buffer.toString().split('\n');
    return await Promise.allSettled(
      importedData.map(async (record) => {
        const recordArray = record
          .replace(/"(.*?)"/g, (str) => str.replaceAll(',', '###COMMA###'))
          .split(',');

        await this.diagnosisService.create({
          categoryCode: recordArray[0]?.replaceAll('###COMMA###', ','),
          diagnosisCode: recordArray[1]?.replaceAll('###COMMA###', ','),
          fullCode: recordArray[2]?.replaceAll('###COMMA###', ','),
          abbreviatedDescription: recordArray[3]?.replaceAll(
            '###COMMA###',
            ',',
          ),
          fullDescription: recordArray[4]?.replaceAll('###COMMA###', ','),
          categoryTitle: recordArray[5]?.replaceAll('###COMMA###', ','),
        });
      }),
    );
  }

  @ApiQuery({
    name: 'page',
    type: 'integer',
    description: 'The Page Number',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: 'integer',
    description: 'The Number of Elements per page',
    required: false,
  })
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit = 25,
  ): Promise<Pagination<Diagnosis>> {
    limit = limit > 100 ? 100 : limit;
    return this.diagnosisService.findAll({
      page,
      limit,
      route: `${process.env.BASE_URL}/api/v1/diagnosis`,
    });
  }

  @Get(':diagnosisId')
  findOne(@Param('diagnosisId') diagnosisId: string) {
    return this.diagnosisService.findOne(diagnosisId);
  }

  @Patch()
  update(@Body() updateDiagnosisDto: UpdateDiagnosisDto) {
    return this.diagnosisService.update(updateDiagnosisDto);
  }

  @Delete(':diagnosisId')
  remove(@Param('diagnosisId') diagnosisId: string) {
    return this.diagnosisService.remove(diagnosisId);
  }
}
