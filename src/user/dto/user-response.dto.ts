import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  id: number;

  @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя' })
  name: string;

  @ApiProperty({ example: 'ivan@example.com', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: '2026-01-15T10:00:00.000Z', description: 'Дата регистрации' })
  createdAt: Date;
}
