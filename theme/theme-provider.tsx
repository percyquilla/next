'use client';

import type { ThemeOptions } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { useSettingsContext } from '@/components/settings';

import { Rtl } from './with-settings/right-to-left';
import { createTheme } from './create-theme';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  themeOverrides?: ThemeOptions;
};

export function ThemeProvider({ children, themeOverrides }: Props) {
  const settings = useSettingsContext();

  const theme = createTheme({
    settingsState: settings.state,
    themeOverrides,
  });

  return (
    <MuiThemeProvider disableTransitionOnChange theme={theme}>
      <CssBaseline />
      <Rtl direction={settings.state.direction as 'ltr' | 'rtl'}>{children}</Rtl>
    </MuiThemeProvider>
  );
}
