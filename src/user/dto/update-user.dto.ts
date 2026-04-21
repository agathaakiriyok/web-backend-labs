import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Иван Иванов', description: 'Новое имя' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'ivan@example.com', description: 'Новый email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'newpass', description: 'Новый пароль (минимум 4 символа)', minLength: 4 })
  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string;
}
