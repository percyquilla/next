'use client';

import type { Ref, ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

import SimpleBar from 'simplebar-react';
import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

import { scrollbarClasses } from './classes';

// ----------------------------------------------------------------------

type ScrollbarProps = {
  sx?: SxProps<Theme>;
  ref?: Ref<any>;
  children?: ReactNode;
  className?: string;
  slotProps?: { wrapperSx?: any; contentWrapperSx?: any; contentSx?: any };
  fillContent?: boolean;
  [key: string]: any;
};

export function Scrollbar({
  sx,
  ref,
  children,
  className,
  slotProps,
  fillContent = true,
  ...other
}: ScrollbarProps) {
  return (
    <ScrollbarRoot
      scrollableNodeProps={{ ref }}
      clickOnTrack={false}
      fillContent={fillContent}
      className={mergeClasses([scrollbarClasses.root, className])}
      sx={[
        {
          '& .simplebar-wrapper': slotProps?.wrapperSx,
          '& .simplebar-content-wrapper': slotProps?.contentWrapperSx,
          '& .simplebar-content': slotProps?.contentSx,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </ScrollbarRoot>
  );
}

// ----------------------------------------------------------------------

const ScrollbarRoot = styled(SimpleBar, {
  shouldForwardProp: (prop) => !['fillContent', 'sx'].includes(prop as string),
})<{ fillContent?: boolean }>(({ fillContent }) => ({
  minWidth: 0,
  minHeight: 0,
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  ...(fillContent && {
    '& .simplebar-content': {
      display: 'flex',
      flex: '1 1 auto',
      minHeight: '100%',
      flexDirection: 'column',
    },
  }),
}));
