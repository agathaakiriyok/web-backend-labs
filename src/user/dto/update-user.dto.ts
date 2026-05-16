import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Иван Иванов', description: 'Новое имя' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'ivan@example.com', description: 'Новый email' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
