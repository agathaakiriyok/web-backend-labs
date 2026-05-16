import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'qwerty' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @MinLength(1)
  password: string;
}
