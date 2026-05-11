import { Inject, Injectable } from '@nestjs/common';
import type { App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { Request, Response } from 'express';
import { PrismaService } from '../prisma.service';
import { AUTH_MODULE_OPTIONS, FIREBASE_ADMIN } from './auth.constants';
import type { AuthModuleOptions } from './auth-module-options.interface';

export const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(FIREBASE_ADMIN) private readonly firebaseApp: App,
    @Inject(AUTH_MODULE_OPTIONS) private readonly options: AuthModuleOptions,
  ) {}

  private get firebaseAuth() {
    return getAuth(this.firebaseApp);
  }

  async login(email: string, password: string, res: Response) {
    const fbRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.options.webApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );
    if (!fbRes.ok) return null;

    const { idToken, localId: uid } = (await fbRes.json()) as {
      idToken: string;
      localId: string;
    };

    const user = await this.prisma.user.findUnique({ where: { firebaseUid: uid } });
    if (!user) return null;

    const sessionCookie = await this.firebaseAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });
    this.setSessionCookie(res, sessionCookie);

    return user;
  }

  async register(name: string, email: string, password: string, res: Response) {
    // Reject if already fully registered (has firebaseUid)
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing?.firebaseUid) return { error: 'exists' as const };

    const fbRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.options.webApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );
    if (!fbRes.ok) {
      const err = await fbRes.json().catch(() => ({})) as any;
      const code: string = err?.error?.message ?? 'UNKNOWN';
      if (code === 'EMAIL_EXISTS') return { error: 'exists' as const };
      if (code.startsWith('WEAK_PASSWORD')) return { error: 'weak_password' as const };
      return { error: 'firebase' as const };
    }

    const { idToken, localId: uid } = (await fbRes.json()) as {
      idToken: string;
      localId: string;
    };

    // Link existing DB user (migrated from old system) or create new one
    const user = existing
      ? await this.prisma.user.update({ where: { id: existing.id }, data: { firebaseUid: uid } })
      : await this.prisma.user.create({ data: { name, email, firebaseUid: uid } });

    const sessionCookie = await this.firebaseAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });
    this.setSessionCookie(res, sessionCookie);

    return { user };
  }

  async verifySession(req: Request) {
    const cookie = this.parseCookie(req, SESSION_COOKIE_NAME);
    if (!cookie) return null;

    try {
      const decoded = await this.firebaseAuth.verifySessionCookie(cookie, true);
      const user = await this.prisma.user.findUnique({
        where: { firebaseUid: decoded.uid },
      });
      if (!user) return null;
      return { uid: decoded.uid, userId: user.id, name: user.name, role: user.role };
    } catch {
      return null;
    }
  }

  clearSessionCookie(res: Response) {
    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
  }

  private setSessionCookie(res: Response, value: string) {
    res.cookie(SESSION_COOKIE_NAME, value, {
      maxAge: SESSION_DURATION_MS,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  private parseCookie(req: Request, name: string): string | undefined {
    const header = req.headers.cookie ?? '';
    for (const part of header.split(';')) {
      const [key, ...rest] = part.trim().split('=');
      if (key.trim() === name) return decodeURIComponent(rest.join('=').trim());
    }
    return undefined;
  }
}
