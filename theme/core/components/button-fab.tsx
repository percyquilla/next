import type { CSSObject, Theme } from '@mui/material/styles';

import { pxToRem, varAlpha } from 'minimal-shared/utils';

import { fabClasses } from '@mui/material/Fab';

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

function paletteColor(theme: ThemeWithVars): Record<string, { main: string }> {
  return theme.vars.palette as unknown as Record<string, { main: string }>;
}

function commonColors(theme: ThemeWithVars): Record<string, string> {
  return theme.vars.palette.common as unknown as Record<string, string>;
}

const baseColors = ['default', 'inherit'];
const allColors = [...baseColors, ...colorKeys.palette, ...colorKeys.common];

const VARIANTS = {
  filled: ['circular', 'extended'],
  outlined: ['outlined', 'outlinedExtended'],
  soft: ['soft', 'softExtended'],
  extended: ['extended', 'outlinedExtended', 'softExtended'],
};
const DIMENSIONS = {
  extendedSmall: {
    '--size': '36px',
    padding: '4px 8px',
    fontSize: pxToRem(13),
    lineHeight: 22 / 13,
  },
  extendedMedium: {
    '--size': '40px',
    padding: '6px 12px',
    fontSize: pxToRem(14),
    lineHeight: 24 / 14,
  },
  extendedLarge: {
    '--size': '48px',
    padding: '8px 16px',
    fontSize: pxToRem(15),
    lineHeight: 26 / 15,
  },
};

function isVariant(allowed: string[], variant: string | undefined): boolean {
  return !!variant && allowed.includes(variant);
}

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const filledVariants = [
  {
    props: (props: PropsArg) => isVariant(VARIANTS.filled, props.variant) && props.color === 'default',
    style: ({ theme }: StyleArg): CSSObject => ({
      ...theme.mixins.filledStyles(theme, 'default', { hover: true }),
      boxShadow: cshadows(theme).z8,
    }),
  },
  {
    props: (props: PropsArg) => isVariant(VARIANTS.filled, props.variant) && props.color === 'inherit',
    style: ({ theme }: StyleArg): CSSObject => ({
      ...theme.mixins.filledStyles(theme, 'inherit', { hover: true }),
      boxShadow: cshadows(theme).z8,
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props: PropsArg) => isVariant(VARIANTS.filled, props.variant) && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      ...theme.mixins.filledStyles(theme, colorKey, { hover: true }),
      boxShadow: cshadows(theme).z8,
    }),
  })),
  ...colorKeys.palette.map((colorKey) => ({
    props: (props: PropsArg) => isVariant(VARIANTS.filled, props.variant) && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      boxShadow: (cshadows(theme) as unknown as Record<string, string>)[colorKey],
    }),
  })),
];

const outlinedVariants = [
  {
    props: (props: PropsArg) => isVariant(VARIANTS.outlined, props.variant),
    style: ({ theme }: StyleArg): CSSObject => ({
      borderWidth: 1,
      boxShadow: 'none',
      borderStyle: 'solid',
      backgroundColor: 'transparent',
      borderColor: varAlpha('currentColor', opacity(theme).outlined.border),
      '&:hover': {
        borderColor: 'currentColor',
        boxShadow: '0 0 0 0.75px currentColor',
        backgroundColor: varAlpha('currentColor', theme.vars.palette.action.hoverOpacity),
      },
    }),
  },
  {
    props: (props: PropsArg) =>
      isVariant(VARIANTS.outlined, props.variant) &&
      (props.color === 'default' || props.color === 'inherit'),
    style: ({ theme }: StyleArg): CSSObject => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
    }),
  },
  {
    props: (props: PropsArg) => isVariant(VARIANTS.outlined, props.variant) && props.color === 'default',
    style: ({ theme }: StyleArg): CSSObject => ({
      color: theme.vars.palette.action.active,
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props: PropsArg) => isVariant(VARIANTS.outlined, props.variant) && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      color: commonColors(theme)[colorKey],
    }),
  })),
  ...colorKeys.palette.map((colorKey) => ({
    props: (props: PropsArg) => isVariant(VARIANTS.outlined, props.variant) && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      color: paletteColor(theme)[colorKey].main,
    }),
  })),
];

const softVariants = [
  ...allColors.map((colorKey) => ({
    props: (props: PropsArg) => isVariant(VARIANTS.soft, props.variant) && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      ...theme.mixins.softStyles(theme, colorKey, { hover: true }),
    }),
  })),
];

const sizeVariants = [
  {
    props: (props: PropsArg) => isVariant(VARIANTS.extended, props.variant),
    style: ({ theme }: StyleArg): CSSObject => ({
      width: 'auto',
      height: 'auto',
      gap: theme.spacing(1),
      minWidth: 'var(--size)',
      minHeight: 'var(--size)',
      borderRadius: 'calc(var(--size) / 2)',
    }),
  },
  {
    props: (props: PropsArg) => isVariant(VARIANTS.extended, props.variant) && props.size === 'small',
    style: { ...DIMENSIONS.extendedSmall },
  },
  {
    props: (props: PropsArg) => isVariant(VARIANTS.extended, props.variant) && props.size === 'medium',
    style: { ...DIMENSIONS.extendedMedium },
  },
  {
    props: (props: PropsArg) => isVariant(VARIANTS.extended, props.variant) && props.size === 'large',
    style: { ...DIMENSIONS.extendedLarge },
  },
];

const disabledVariants = [
  {
    props: (props: PropsArg) => isVariant(VARIANTS.outlined, props.variant),
    style: ({ theme }: StyleArg): CSSObject => ({
      [`&.${fabClasses.disabled}`]: {
        backgroundColor: 'transparent',
        borderColor: theme.vars.palette.action.disabledBackground,
      },
    }),
  },
];

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiFab = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    color: 'primary',
    size: 'medium',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      '&:hover': { boxShadow: 'none' },
      variants: [
        ...filledVariants,
        ...outlinedVariants,
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
export const fab = {
  MuiFab,
};
