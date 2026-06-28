'use client';

import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

import { layoutClasses } from './classes';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
  children?: ReactNode;
  className?: string;
};

export function MainSection({ children, className, sx }: Props) {
  return (
    <MainRoot className={mergeClasses([layoutClasses.main, className])} sx={sx}>
      {children}
    </MainRoot>
  );
}

// ----------------------------------------------------------------------

const MainRoot = styled('main')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
});
