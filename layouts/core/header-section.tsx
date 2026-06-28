'use client';

import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

import { useScrollOffsetTop } from 'minimal-shared/hooks';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

import { layoutClasses } from './classes';

// ----------------------------------------------------------------------

type Slots = {
  topArea?: ReactNode;
  leftArea?: ReactNode;
  centerArea?: ReactNode;
  rightArea?: ReactNode;
  bottomArea?: ReactNode;
};

type Props = {
  sx?: SxProps<Theme>;
  slots?: Slots;
  className?: string;
  disableOffset?: boolean;
  disableElevation?: boolean;
  layoutQuery?: 'sm' | 'md' | 'lg';
};

export function HeaderSection({
  sx,
  slots,
  className,
  disableOffset,
  disableElevation,
  layoutQuery = 'md',
}: Props) {
  const { offsetTop: isOffset } = useScrollOffsetTop();

  return (
    <HeaderRoot
      position="sticky"
      color="transparent"
      isOffset={isOffset}
      disableOffset={disableOffset}
      disableElevation={disableElevation}
      className={mergeClasses([layoutClasses.header, className])}
      sx={[
        (theme: any) => ({
          ...(isOffset && {
            '--color': `var(--offset-color, ${theme.vars?.palette.text.primary})`,
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {slots?.topArea}

      <HeaderContainer layoutQuery={layoutQuery}>
        {slots?.leftArea}
        <HeaderCenterArea>{slots?.centerArea}</HeaderCenterArea>
        {slots?.rightArea}
      </HeaderContainer>

      {slots?.bottomArea}
    </HeaderRoot>
  );
}

// ----------------------------------------------------------------------

const HeaderRoot = styled(AppBar, {
  shouldForwardProp: (prop) =>
    !['isOffset', 'disableOffset', 'disableElevation', 'sx'].includes(prop as string),
})<{ isOffset?: boolean; disableOffset?: boolean; disableElevation?: boolean }>(
  ({ isOffset, disableOffset, disableElevation, theme }) => {
    const pauseStyles = {
      opacity: 0,
      content: '""',
      visibility: 'hidden' as const,
      position: 'absolute' as const,
      transition: theme.transitions.create(['opacity', 'visibility'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
      }),
    };

    const bgStyles = {
      ...theme.mixins.bgBlur({
        color: varAlpha((theme as any).vars?.palette.background.defaultChannel, 0.8),
      }),
      ...pauseStyles,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      ...(isOffset && { opacity: 1, visibility: 'visible' as const }),
    };

    const shadowStyles = {
      ...pauseStyles,
      left: 0,
      right: 0,
      bottom: 0,
      height: 24,
      margin: 'auto',
      borderRadius: '50%',
      width: `calc(100% - 48px)`,
      zIndex: -2,
      boxShadow: (theme as any).vars?.customShadows?.z8,
      ...(isOffset && { opacity: 0.48, visibility: 'visible' as const }),
    };

    return {
      zIndex: 'var(--layout-header-zIndex)' as any,
      ...(!disableOffset && { '&::before': bgStyles }),
      ...(!disableElevation && { '&::after': shadowStyles }),
    };
  }
);

const HeaderContainer = styled(Container, {
  shouldForwardProp: (prop) => !['layoutQuery', 'sx'].includes(prop as string),
})<{ layoutQuery?: string }>(({ layoutQuery = 'md', theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: 'var(--color)',
  height: 'var(--layout-header-mobile-height)',
  [(theme as any).breakpoints.up(layoutQuery)]: {
    height: 'var(--layout-header-desktop-height)',
  },
}));

const HeaderCenterArea = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  justifyContent: 'center',
});
