import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const proxy = auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    // Excluye login, rutas de auth, webhook público, archivos estáticos y assets PWA
    '/((?!login|api/auth|api/webhook/whatsapp|_next/static|_next/image|favicon\\.ico|icons|manifest\\.json|sw\\.js|workbox-).*)',
  ],
};
