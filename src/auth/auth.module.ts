import { DynamicModule, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { RolesGuard } from './roles.guard';
import { AuthModuleOptions } from './auth-module-options.interface';

export const AUTH_MODULE_OPTIONS = 'AUTH_MODULE_OPTIONS';

@Module({})
export class AuthModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      controllers: [AuthController],
      providers: [
        { provide: AUTH_MODULE_OPTIONS, useValue: options },
        AuthService,
        AuthGuard,
        AdminGuard,
        RolesGuard,
      ],
      exports: [AuthService, AuthGuard, AdminGuard, RolesGuard, AUTH_MODULE_OPTIONS],
    };
  }
}
