import type { Metadata } from 'next';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next App',
  description: 'Next.js con Material UI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="data-color-scheme" defaultMode="light" />
        <AppRouterCacheProvider options={{ key: 'css' }}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
