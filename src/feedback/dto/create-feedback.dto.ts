import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ example: 'Отличная выставка!', description: 'Текст отзыва (минимум 5 символов)', minLength: 5 })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  text: string;
}
