import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserApiController } from './user.api.controller';

@Module({
  controllers: [UserController, UserApiController],
  providers: [UserService],
})
export class UserModule {}
