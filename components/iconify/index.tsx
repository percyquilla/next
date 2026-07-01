'use client';

import type { SxProps, Theme } from '@mui/material/styles';

export const iconifyClasses = {
  root: 'iconify__root',
};

import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type IconifyProps = {
  icon: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
};

export function Iconify({ icon, width = 20, height, sx, ...other }: IconifyProps) {
  return (
    <Box
      component={Icon}
      icon={icon}
      sx={[{ width, height: height ?? width }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    />
  );
}
