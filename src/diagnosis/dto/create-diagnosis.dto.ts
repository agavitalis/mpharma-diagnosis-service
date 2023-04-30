import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiagnosisDto {
  @ApiProperty({
    description: 'Category Code',
    example: 'A0',
  })
  @IsString()
  @IsNotEmpty()
  public categoryCode: string;

  @ApiProperty({
    description: 'Diagnosis Code',
    example: '1234',
  })
  @IsString()
  @IsNotEmpty()
  public diagnosisCode: string;

  @ApiProperty({
    description: 'Full Code',
    example: 'A01234',
  })
  @IsString()
  @IsNotEmpty()
  public fullCode: string;

  @ApiProperty({
    description: 'Abbreviated Description',
    example: 'Comma-ind anal ret',
  })
  @IsString()
  @IsNotEmpty()
  public abbreviatedDescription: string;

  @ApiProperty({
    description: 'Full Description',
    example: 'Comma-induced anal retention',
  })
  @IsString()
  @IsNotEmpty()
  public fullDescription: string;

  @ApiProperty({
    description: 'Category Title',
    example: 'Malignant neoplasm of anus and anal canal',
  })
  @IsString()
  @IsNotEmpty()
  public categoryTitle: string;
}
