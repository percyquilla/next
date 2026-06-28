import type { CSSObject, Theme } from '@mui/material/styles';
import type { SvgIconProps } from '@mui/material/SvgIcon';

import SvgIcon from '@mui/material/SvgIcon';
import { chipClasses } from '@mui/material/Chip';

import { colorKeys } from '../palette';

// ----------------------------------------------------------------------

type ThemeWithVars = Theme & { vars: NonNullable<Theme['vars']> };
type StyleArg = { theme: ThemeWithVars };
type PropsArg = { variant?: string; color?: string; size?: string };

function paletteColor(theme: ThemeWithVars): Record<string, { lighter: string; dark: string }> {
  return theme.vars.palette as unknown as Record<string, { lighter: string; dark: string }>;
}

function commonColors(theme: ThemeWithVars): Record<string, string> {
  return theme.vars.palette.common as unknown as Record<string, string>;
}

const baseColors = ['default'];
const allColors = [...baseColors, ...colorKeys.palette, ...colorKeys.common];

const DIMENSIONS = {
  small: { borderRadius: '8px' },
  medium: { borderRadius: '10px' },
};

/* **********************************************************************
 * ♉️ Custom icons
 * **********************************************************************/
const DeleteIcon = (props: SvgIconProps) => (
  // https://icon-sets.iconify.design/solar/close-circle-bold/
  <SvgIcon {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 0 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 0 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06"
      clipRule="evenodd"
    />
  </SvgIcon>
);

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const filledVariants = [
  {
    props: (props: PropsArg) => props.variant === 'filled' && props.color === 'default',
    style: ({ theme }: StyleArg): CSSObject => ({
      ...theme.mixins.filledStyles(theme, 'inherit'),
      [`&.${chipClasses.clickable}`]: {
        ...theme.mixins.filledStyles(theme, 'inherit', { hover: true }),
      },
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props: PropsArg) => props.variant === 'filled' && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      ...theme.mixins.filledStyles(theme, colorKey),
      [`&.${chipClasses.clickable}`]: {
        ...theme.mixins.filledStyles(theme, colorKey, { hover: true }),
      },
    }),
  })),
];

const outlinedVariants = [
  {
    props: (props: PropsArg) => props.variant === 'outlined',
    style: {
      borderColor: 'currentColor',
    },
  },
  {
    props: (props: PropsArg) => props.variant === 'outlined' && props.color === 'default',
    style: ({ theme }: StyleArg): CSSObject => ({
      borderColor: theme.vars.palette.shared.buttonOutlined,
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props: PropsArg) => props.variant === 'outlined' && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      color: commonColors(theme)[colorKey],
    }),
  })),
];

const softVariants = [
  ...allColors.map((colorKey) => ({
    props: (props: PropsArg) => props.variant === 'soft' && props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => {
      const currentColor = colorKey === 'default' ? 'inherit' : colorKey;

      return {
        ...theme.mixins.softStyles(theme, currentColor),
        [`&.${chipClasses.clickable}`]: {
          ...theme.mixins.softStyles(theme, currentColor, { hover: true }),
        },
      };
    },
  })),
];

const avatarVariants = [
  ...colorKeys.common.map((colorKey) => ({
    props: (props: PropsArg) => props.color === colorKey,
    style: {
      color: 'inherit',
      backgroundColor: 'color-mix(in srgb, currentColor 24%, transparent)',
    },
  })),
  ...colorKeys.palette.map((colorKey) => ({
    props: (props: PropsArg) => props.color === colorKey,
    style: ({ theme }: StyleArg): CSSObject => ({
      color: paletteColor(theme)[colorKey].lighter,
      backgroundColor: paletteColor(theme)[colorKey].dark,
    }),
  })),
];

const sizeVariants = [
  {
    props: (props: PropsArg) => props.size === 'small',
    style: { ...DIMENSIONS.small },
  },
  {
    props: (props: PropsArg) => props.size === 'medium',
    style: { ...DIMENSIONS.medium },
  },
];

const disabledVariants = [
  {
    props: {},
    style: ({ theme }: StyleArg): CSSObject => ({
      [`&.${chipClasses.disabled}`]: {
        opacity: 1,
        color: theme.vars.palette.action.disabled,
        [`&:not(.${chipClasses.outlined})`]: {
          backgroundColor: theme.vars.palette.action.disabledBackground,
        },
        [`&.${chipClasses.outlined}`]: {
          borderColor: theme.vars.palette.action.disabledBackground,
        },
        [`& .${chipClasses.avatar}`]: {
          color: theme.vars.palette.action.disabled,
          backgroundColor: theme.vars.palette.action.disabledBackground,
          '& img': { opacity: theme.vars.palette.action.disabledOpacity },
        },
      },
    }),
  },
];

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiChip = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    deleteIcon: <DeleteIcon />,
    variant: 'soft',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      variants: [
        ...filledVariants,
        ...outlinedVariants,
        ...softVariants,
        ...sizeVariants,
        ...disabledVariants,
      ],
    },
    label: ({ theme }: StyleArg) => ({
      fontWeight: theme.typography.fontWeightMedium,
    }),
    avatar: {
      variants: [...avatarVariants],
    },
    icon: {
      color: 'currentColor',
    },
    deleteIcon: {
      opacity: 0.48,
      color: 'currentColor',
      '&:hover': {
        opacity: 0.8,
        color: 'currentColor',
      },
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const chip = {
  MuiChip,
};
