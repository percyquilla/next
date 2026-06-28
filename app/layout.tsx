import type { Metadata } from 'next';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { ThemeProvider } from '@/theme';
import { defaultSettings, SettingsProvider } from '@/components/settings';
import { detectSettings } from '@/components/settings/server';

import './globals.css';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Next App',
  description: 'Next.js con Material UI',
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
          <SettingsProvider
            defaultSettings={defaultSettings}
            cookieSettings={cookieSettings}
          >
            <ThemeProvider>{children}</ThemeProvider>
          </SettingsProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
