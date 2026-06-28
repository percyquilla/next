'use client';

import type { Direction, ThemeOptions } from '@mui/material/styles';

import { createTheme as createMuiTheme } from '@mui/material/styles';

import { mixins } from './core/mixins';
import { opacity } from './core/opacity';
import { shadows } from './core/shadows';
import { palette } from './core/palette';
import { themeConfig } from './theme-config';
import { components } from './core/components';
import { typography } from './core/typography';
import { customShadows } from './core/custom-shadows';

// ----------------------------------------------------------------------

// Cast to `any` because MUI's ColorSystemOptions type doesn't expose the full
// runtime API (e.g. shadows, customShadows, opacity per scheme) in its types yet.
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
  direction: themeConfig.direction as Direction,
  cssVariables: themeConfig.cssVariables,
};

// ----------------------------------------------------------------------

type CreateThemeOptions = {
  /** Partial theme to deep-merge on top of the base theme (palette, shape, etc.). */
  themeOverrides?: ThemeOptions;
};

export function createTheme({ themeOverrides = {} }: CreateThemeOptions = {}) {
  return createMuiTheme(baseTheme, themeOverrides);
}
