import { DynamicModule, Module } from '@nestjs/common';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import type { App } from 'firebase-admin/app';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { RolesGuard } from './roles.guard';
import { SessionContextMiddleware } from './session-context.middleware';
import { AuthModuleOptions } from './auth-module-options.interface';
import { AUTH_MODULE_OPTIONS, FIREBASE_ADMIN } from './auth.constants';

export { AUTH_MODULE_OPTIONS, FIREBASE_ADMIN } from './auth.constants';

const APP_NAME = 'hermitage';

@Module({})
export class AuthModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    const firebaseApp: App =
      getApps().find((a) => a.name === APP_NAME) ??
      initializeApp(
        {
          credential: cert({
            projectId: options.projectId,
            clientEmail: options.clientEmail,
            privateKey: options.privateKey.replace(/\\n/g, '\n'),
          }),
        },
        APP_NAME,
      );

    return {
      module: AuthModule,
      controllers: [AuthController],
      providers: [
        { provide: AUTH_MODULE_OPTIONS, useValue: options },
        { provide: FIREBASE_ADMIN, useValue: firebaseApp },
        AuthService,
        AuthGuard,
        AdminGuard,
        RolesGuard,
        SessionContextMiddleware,
      ],
      exports: [
        AuthService,
        AuthGuard,
        AdminGuard,
        RolesGuard,
        SessionContextMiddleware,
        AUTH_MODULE_OPTIONS,
        FIREBASE_ADMIN,
      ],
    };
  }
}
