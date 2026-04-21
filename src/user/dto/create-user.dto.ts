import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ivan@example.com', description: 'Email пользователя (уникальный)' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', description: 'Пароль (минимум 4 символа)', minLength: 4 })
  @IsString()
  @MinLength(4)
  password: string;
}
