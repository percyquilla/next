'use client';

import type { ReactNode, CSSProperties } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

import { layoutClasses } from './classes';
import { layoutSectionVars } from './css-vars';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
  cssVars?: CSSProperties;
  children?: ReactNode;
  className?: string;
  headerSection?: ReactNode;
  footerSection?: ReactNode;
};

export function LayoutSection({ sx, cssVars, children, className, headerSection, footerSection }: Props) {
  const inputGlobalStyles = (
    <GlobalStyles styles={(theme: any) => ({ body: { ...layoutSectionVars(theme), ...cssVars } })} />
  );

  return (
    <>
      {inputGlobalStyles}
      <LayoutRoot
        id="root__layout"
        className={mergeClasses([layoutClasses.root, className])}
        sx={sx}
      >
        {headerSection}
        {children}
        {footerSection}
      </LayoutRoot>
    </>
  );
}

// ----------------------------------------------------------------------

const LayoutRoot = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
});
