import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: 'Código identificador do tipo de erro', example: 'VALIDATION_ERROR' })
  errorCode!: string;

  @ApiProperty({ description: 'Mensagem descritiva do erro', example: 'O campo email é inválido.' })
  message!: string;

  @ApiPropertyOptional({
    description: 'Identificador de correlação da requisição (X-Request-ID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  correlationId?: string;

  @ApiProperty({
    description: 'Data e hora do erro em formato ISO 8601',
    example: '2026-04-03T12:00:00.000Z',
  })
  timestamp!: string;
}
