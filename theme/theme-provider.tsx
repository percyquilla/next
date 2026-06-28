'use client';

import type { ThemeOptions } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { createTheme } from './create-theme';
import { Rtl } from './with-settings/right-to-left';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  /**
   * Optional theme overrides — use this to customise palette, typography,
   * shape, or component defaults without touching the base theme files.
   *
   * @example
   * <ThemeProvider themeOverrides={{ shape: { borderRadius: 4 } }}>
   */
  themeOverrides?: ThemeOptions;
};

export function ThemeProvider({ children, themeOverrides }: Props) {
  const theme = createTheme({ themeOverrides });

  return (
    <MuiThemeProvider disableTransitionOnChange theme={theme}>
      <CssBaseline />
      <Rtl>{children}</Rtl>
    </MuiThemeProvider>
  );
}
