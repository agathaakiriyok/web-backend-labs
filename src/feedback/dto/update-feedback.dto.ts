import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateFeedbackDto {
  @ApiPropertyOptional({ example: 'Обновлённый отзыв', description: 'Новый текст отзыва (минимум 5 символов)', minLength: 5 })
  @IsOptional()
  @IsString()
  @MinLength(5)
  text?: string;
}
