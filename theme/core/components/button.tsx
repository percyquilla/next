import type { CSSObject, Theme } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import { buttonClasses } from '@mui/material/Button';

import { colorKeys } from '../palette';

// ----------------------------------------------------------------------

type ThemeWithVars = Theme & { vars: NonNullable<Theme['vars']> };
type StyleArg = { theme: ThemeWithVars };
type PropsArg = { variant?: string; color?: string; size?: string };

function cshadows(theme: ThemeWithVars): Theme['customShadows'] {
  return theme.customShadows;
}

function opacity(theme: ThemeWithVars): Theme['opacity'] {
  return theme.opacity;
}

function commonColors(theme: ThemeWithVars): Record<string, string> {
  return theme.vars.palette.common as unknown as Record<string, string>;
}

const baseColors = ['inherit'];
const allColors = [...baseColors, ...colorKeys.palette, ...colorKeys.common];

const DIMENSIONS = {
  small: { '--padding-y': '4px', '--padding-x': '8px', minHeight: 30, lineHeight: 22 / 13 },
  medium: { '--padding-y': '6px', '--padding-x': '12px', minHeight: 36, lineHeight: 24 / 14 },
  large: { '--padding-y': '8px', '--padding-x': '16px', minHeight: 48, lineHeight: 26 / 15 },
  xLarge: { minHeight: 56 },
};

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const containedVariants = [
  {
    props: (props: PropsArg) => props.variant === 'contained' && props.color === 'inherit',
    style: ({ theme }: StyleArg): CSSObject => ({
      ...theme.mixins.filledStyles(theme, 'inherit', {
        hover: {
          boxShadow: cshadows(theme).z8,
        },
      }),
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props: PropsArg) => props.variant === 'contained' && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      ...theme.mixins.filledStyles(theme, colorKey, {
        hover: {
          boxShadow: cshadows(theme).z8,
        },
      }),
    }),
  })),
  ...colorKeys.palette.map((colorKey) => ({
    props: (props: PropsArg) => props.variant === 'contained' && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      '&:hover': {
        boxShadow: (cshadows(theme) as unknown as Record<string, string>)[colorKey],
      },
    }),
  })),
];

const outlinedVariants = [
  {
    props: (props: PropsArg) => props.variant === 'outlined',
    style: ({ theme }: StyleArg): CSSObject => ({
      borderColor: varAlpha('currentColor', opacity(theme).outlined.border),
      '&:hover': {
        borderColor: 'currentColor',
        boxShadow: '0 0 0 0.75px currentColor',
        backgroundColor: varAlpha('currentColor', theme.vars.palette.action.hoverOpacity),
      },
    }),
  },
  {
    props: (props: PropsArg) => props.variant === 'outlined' && props.color === 'inherit',
    style: ({ theme }: StyleArg): CSSObject => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props: PropsArg) => props.variant === 'outlined' && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      color: commonColors(theme)[colorKey],
    }),
  })),
];

const textVariants = [
  {
    props: (props: PropsArg) => props.variant === 'text',
    style: ({ theme }: StyleArg): CSSObject => ({
      '&:hover': {
        backgroundColor: varAlpha('currentColor', theme.vars.palette.action.hoverOpacity),
      },
    }),
  },
  {
    props: (props: PropsArg) => props.variant === 'text' && props.color === 'inherit',
    style: ({ theme }: StyleArg): CSSObject => ({
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props: PropsArg) => props.variant === 'text' && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      color: commonColors(theme)[colorKey],
    }),
  })),
];

const softVariants = [
  ...allColors.map((colorKey) => ({
    props: (props: PropsArg) => props.variant === 'soft' && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      ...theme.mixins.softStyles(theme, colorKey, { hover: true }),
    }),
  })),
];

const sizeVariants = [
  {
    props: {},
    style: { padding: 'var(--padding-y) var(--padding-x)' },
  },
  {
    props: (props: PropsArg) => props.size === 'small',
    style: { ...DIMENSIONS.small },
  },
  {
    props: (props: PropsArg) => props.size === 'medium',
    style: { ...DIMENSIONS.medium },
  },
  {
    props: (props: PropsArg) => props.size === 'large' || props.size === 'xLarge',
    style: { ...DIMENSIONS.large },
  },
  {
    props: (props: PropsArg) => props.size === 'xLarge',
    style: ({ theme }: StyleArg): CSSObject => ({ ...DIMENSIONS.xLarge, fontSize: theme.typography.pxToRem(15) }),
  },
  {
    props: (props: PropsArg) => props.variant === 'outlined',
    style: {
      paddingTop: 'calc(var(--padding-y) - 4px)',
      paddingBottom: 'calc(var(--padding-y) - 4px)',
    },
  },
  {
    props: (props: PropsArg) => props.variant === 'text',
    style: {
      paddingLeft: 'calc(var(--padding-x) - 4px)',
      paddingRight: 'calc(var(--padding-x) - 4px)',
    },
  },
];

const disabledVariants = [
  {
    props: (props: PropsArg) => props.variant === 'soft',
    style: ({ theme }: StyleArg): CSSObject => ({
      [`&.${buttonClasses.disabled}`]: {
        backgroundColor: theme.vars.palette.action.disabledBackground,
      },
    }),
  },
];

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiButtonBase = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }: StyleArg) => ({
      fontFamily: theme.typography.fontFamily,
    }),
  },
};

const MuiButton = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: 'inherit',
    disableElevation: true,
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      variants: [
        ...containedVariants,
        ...outlinedVariants,
        ...textVariants,
        ...softVariants,
        ...sizeVariants,
        ...disabledVariants,
      ],
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const button = {
  MuiButton,
  MuiButtonBase,
};
