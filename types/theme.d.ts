import type { CSSObject } from '@mui/material/styles';
import type { Theme as MuiTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// Module augmentations for MUI v9 + custom theme extensions
// ----------------------------------------------------------------------

declare module '@mui/material/styles' {
  // ------------------------------------------------------------------
  // Palette color channels (added by createPaletteChannel)
  // ------------------------------------------------------------------
  interface PaletteColor {
    lighter: string;
    darker: string;
    // Channel variants for varAlpha usage
    lighterChannel: string;
    lightChannel: string;
    mainChannel: string;
    darkChannel: string;
    darkerChannel: string;
    contrastTextChannel: string;
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    lighterChannel?: string;
    lightChannel?: string;
    mainChannel?: string;
    darkChannel?: string;
    darkerChannel?: string;
    contrastTextChannel?: string;
  }

  // ------------------------------------------------------------------
  // Grey scale channels
  // ------------------------------------------------------------------
  interface Color {
    '50Channel': string;
    '100Channel': string;
    '200Channel': string;
    '300Channel': string;
    '400Channel': string;
    '500Channel': string;
    '600Channel': string;
    '700Channel': string;
    '800Channel': string;
    '900Channel': string;
  }

  // ------------------------------------------------------------------
  // Common channels
  // ------------------------------------------------------------------
  interface CommonColors {
    blackChannel: string;
    whiteChannel: string;
  }

  // ------------------------------------------------------------------
  // Text/background channel variants
  // ------------------------------------------------------------------
  interface TypeText {
    primaryChannel: string;
    secondaryChannel: string;
    disabledChannel: string;
  }

  interface TypeBackground {
    neutral: string;
    neutralChannel: string;
    defaultChannel: string;
    paperChannel: string;
  }

  // ------------------------------------------------------------------
  // Custom palette extensions (shared, TableCell)
  // ------------------------------------------------------------------
  interface Palette {
    shared: {
      inputUnderline: string;
      inputOutlined: string;
      paperOutlined: string;
      buttonOutlined: string;
    };
    TableCell: {
      border: string;
    };
  }

  interface PaletteOptions {
    shared?: {
      inputUnderline?: string;
      inputOutlined?: string;
      paperOutlined?: string;
      buttonOutlined?: string;
    };
    TableCell?: {
      border?: string;
    };
  }

  // ------------------------------------------------------------------
  // Custom theme extensions: opacity, customShadows
  // ------------------------------------------------------------------
  interface Theme {
    opacity: {
      switchTrack: number;
      switchTrackDisabled: number;
      inputPlaceholder: number;
      inputUnderline: number;
      filled: { commonHoverBg: number };
      outlined: { border: number };
      soft: { bg: number; hoverBg: number; commonBg: number; commonHoverBg: number; border: number };
    };
    customShadows: {
      z1: string;
      z4: string;
      z8: string;
      z12: string;
      z16: string;
      z20: string;
      z24: string;
      dialog: string;
      card: string;
      dropdown: string;
      primary: string;
      secondary: string;
      info: string;
      success: string;
      warning: string;
      error: string;
    };
  }

  interface ThemeOptions {
    opacity?: Partial<Theme['opacity']>;
    customShadows?: Partial<Theme['customShadows']>;
  }

  // ------------------------------------------------------------------
  // Custom mixins
  // ------------------------------------------------------------------
  interface Mixins {
    hideScrollX: CSSObject;
    hideScrollY: CSSObject;
    scrollbarStyles: (theme: MuiTheme) => CSSObject;
    bgBlur: (options: { color?: string; blur?: number; imgUrl?: string }) => CSSObject;
    bgGradient: (options: { images?: string[]; sizes?: string[]; positions?: string[]; repeats?: string[] }) => CSSObject;
    maxLine: (options: { line: number; persistent?: Record<string, unknown> }) => CSSObject;
    textGradient: (color: string) => CSSObject;
    borderGradient: (options?: { color?: string; padding?: string }) => CSSObject;
    paperStyles: (theme: MuiTheme, options?: { blur?: number; color?: string; dropdown?: boolean }) => CSSObject;
    menuItemStyles: (theme: MuiTheme) => CSSObject;
    softStyles: (theme: MuiTheme, colorKey: string, options?: { hover?: boolean | CSSObject }) => CSSObject;
    filledStyles: (theme: MuiTheme, colorKey: string, options?: { hover?: boolean | CSSObject }) => CSSObject;
  }

  // ------------------------------------------------------------------
  // Extend CssVarsTheme for vars.opacity and vars.customShadows
  // ------------------------------------------------------------------
  interface CssVarsTheme {
    opacity: Theme['opacity'];
    customShadows: Theme['customShadows'];
  }

  // Typography custom font weights
  interface TypographyVariants {
    fontWeightSemiBold: number;
  }

  interface TypographyVariantsOptions {
    fontWeightSemiBold?: number;
  }
}

// ------------------------------------------------------------------
// Component variant augmentations
// ------------------------------------------------------------------

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
  interface ButtonPropsColorOverrides {
    white: true;
    black: true;
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsVariantOverrides {
    soft: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
}

declare module '@mui/material/Badge' {
  interface BadgePropsVariantOverrides {
    soft: true;
  }
}

declare module '@mui/material/Fab' {
  interface FabPropsVariantOverrides {
    soft: true;
  }
}

declare module '@mui/material/Tabs' {
  interface TabsPropsIndicatorColorOverrides {
    custom: true;
  }
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsVariantOverrides {
    soft: true;
  }
}

export {};
