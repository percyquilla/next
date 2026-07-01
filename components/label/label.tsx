'use client';

import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

import { upperFirst } from 'es-toolkit';
import { mergeClasses } from 'minimal-shared/utils';

import { labelClasses } from './classes';
import { LabelRoot, LabelIcon } from './styles';

// ----------------------------------------------------------------------

type LabelProps = {
  sx?: SxProps<Theme>;
  endIcon?: ReactNode;
  children?: ReactNode;
  startIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: string;
  color?: string;
  [key: string]: any;
};

export function Label({
  sx,
  endIcon,
  children,
  startIcon,
  className,
  disabled,
  variant = 'soft',
  color = 'default',
  ...other
}: LabelProps) {
  return (
    <LabelRoot
      color={color}
      variant={variant}
      disabled={disabled}
      className={mergeClasses([labelClasses.root, className])}
      sx={sx}
      {...other}
    >
      {startIcon && <LabelIcon className={labelClasses.icon}>{startIcon}</LabelIcon>}

      {typeof children === 'string' ? upperFirst(children) : children}

      {endIcon && <LabelIcon className={labelClasses.icon}>{endIcon}</LabelIcon>}
    </LabelRoot>
  );
}
