'use client';

import type { ThemeOptions } from '@mui/material/styles';

import { createTheme as createMuiTheme } from '@mui/material/styles';

import { mixins } from './core/mixins';
import { opacity } from './core/opacity';
import { shadows } from './core/shadows';
import { palette } from './core/palette';
import { themeConfig } from './theme-config';
import { components } from './core/components';
import { typography } from './core/typography';
import { customShadows } from './core/custom-shadows';
import { applySettingsToTheme, applySettingsToComponents } from './with-settings';

// ----------------------------------------------------------------------

export const baseTheme: any = {
  colorSchemes: {
    light: {
      palette: palette.light,
      shadows: shadows.light,
      customShadows: customShadows.light,
      opacity,
    },
    dark: {
      palette: palette.dark,
      shadows: shadows.dark,
      customShadows: customShadows.dark,
      opacity,
    },
  },
  mixins,
  components,
  typography,
  shape: { borderRadius: 8 },
  direction: themeConfig.direction,
  cssVariables: themeConfig.cssVariables,
};

// ----------------------------------------------------------------------

type CreateThemeOptions = {
  settingsState?: Record<string, any>;
  themeOverrides?: ThemeOptions;
  localeComponents?: Record<string, any>;
};

export function createTheme({
  settingsState,
  themeOverrides = {},
  localeComponents = {},
}: CreateThemeOptions = {}) {
  const updatedCore = settingsState ? applySettingsToTheme(baseTheme, settingsState) : baseTheme;
  const updatedComponents = settingsState ? applySettingsToComponents(settingsState) : {};

  return createMuiTheme(updatedCore, updatedComponents, localeComponents, themeOverrides);
}
