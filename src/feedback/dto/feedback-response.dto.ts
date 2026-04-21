import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class FeedbackResponseDto {
  @ApiProperty({ example: 1, description: 'ID отзыва' })
  id: number;

  @ApiProperty({ example: 'Потрясающая экспозиция!', description: 'Текст отзыва' })
  text: string;

  @ApiProperty({ example: '2026-04-22T12:00:00.000Z', description: 'Дата создания отзыва' })
  createdAt: Date;

  @ApiProperty({ example: 4, description: 'ID автора отзыва' })
  userId: number;

  @ApiProperty({ type: () => UserResponseDto, description: 'Автор отзыва' })
  user: UserResponseDto;
}
