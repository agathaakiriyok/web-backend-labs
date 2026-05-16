import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ivan@example.com', description: 'Email пользователя (уникальный)' })
  @IsEmail()
  email: string;
}
