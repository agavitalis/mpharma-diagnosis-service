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
  Res,
} from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Diagnosis } from './entities/diagnosis.entity';
import { UploadDiagnosisDto } from './dto/upload-diagnosis.dto';
import { customResponse } from 'src/config/response';
import { Response } from 'express';

@ApiTags('Diagnosis')
@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post()
  async create(
    @Body() createDiagnosisDto: CreateDiagnosisDto,
    @Res() res: Response,
  ) {
    const diagnosis = await this.diagnosisService.create(createDiagnosisDto);
    return customResponse(
      res,
      200,
      'Diagnosis successfully created',
      diagnosis,
      null,
    );
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Res() res: Response,
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
    const diagnosis = await this.diagnosisService.upload(file);
    return customResponse(
      res,
      diagnosis as unknown as number,
      'Diagnosis successfully uploaded',
      null,
      null,
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
  async findOne(
    @Param('diagnosisId') diagnosisId: string,
    @Res() res: Response,
  ) {
    const diagnosis = await this.diagnosisService.findOne(diagnosisId);
    return customResponse(
      res,
      200,
      'Diagnosis successfully retrived',
      diagnosis,
      null,
    );
  }

  @Patch()
  async update(
    @Body() updateDiagnosisDto: UpdateDiagnosisDto,
    @Res() res: Response,
  ) {
    const diagnosis = await this.diagnosisService.update(updateDiagnosisDto);
    return customResponse(
      res,
      200,
      'Diagnosis successfully updated',
      diagnosis,
      null,
    );
  }

  @Delete(':diagnosisId')
  async remove(
    @Param('diagnosisId') diagnosisId: string,
    @Res() res: Response,
  ) {
    const diagnosis = await this.diagnosisService.remove(diagnosisId);
    return customResponse(
      res,
      200,
      'Diagnosis successfully deleted',
      diagnosis,
      null,
    );
  }
}
