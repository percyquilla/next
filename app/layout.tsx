import type { Metadata } from 'next';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { Toaster } from 'sonner';

import { ThemeProvider } from '@/theme';
import { PwaRegister } from '@/components/pwa-register';
import { defaultSettings, SettingsProvider } from '@/components/settings';
import { detectSettings } from '@/components/settings/server';
import { NextAuthSessionProvider } from '@/auth/session-provider';

import './globals.css';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Mi App',
  description: 'Gestión de personas y mensajería WhatsApp',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mi App',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieSettings = await detectSettings();

  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="data-color-scheme" defaultMode="light" />
        <AppRouterCacheProvider options={{ key: 'css' }}>
          <NextAuthSessionProvider>
            <SettingsProvider
              defaultSettings={defaultSettings}
              cookieSettings={cookieSettings}
            >
              <ThemeProvider>{children}</ThemeProvider>
            </SettingsProvider>
          </NextAuthSessionProvider>
        </AppRouterCacheProvider>
        <PwaRegister />
        <Toaster position="bottom-center" richColors closeButton />
      </body>
    </html>
  );
}
