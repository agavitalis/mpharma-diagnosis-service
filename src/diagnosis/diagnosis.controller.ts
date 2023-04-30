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
  create(@Body() createDiagnosisDto: CreateDiagnosisDto) {
    return this.diagnosisService.create(createDiagnosisDto);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  upload(
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
    // file: file.buffer.toString(),
    console.log(file);
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
