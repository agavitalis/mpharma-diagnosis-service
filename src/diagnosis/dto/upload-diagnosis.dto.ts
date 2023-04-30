import { ApiProperty } from '@nestjs/swagger';

export class UploadDiagnosisDto {
  @ApiProperty({
    description: 'The diagnosis csv file to be uploaded',
    type: 'string',
    format: 'binary',
    required: true,
  })
  public file: Express.Multer.File;
}
