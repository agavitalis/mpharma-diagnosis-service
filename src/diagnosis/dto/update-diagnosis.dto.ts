import { PartialType } from '@nestjs/mapped-types';
import { CreateDiagnosisDto } from './create-diagnosis.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDiagnosisDto extends PartialType(CreateDiagnosisDto) {
  @ApiProperty({
    description: 'The diagnosis Id to be modified',
    example: 'QwYNx68xEX',
  })
  @IsString()
  @IsNotEmpty()
  public diagnosisId: string;
}
