'use client';

import type { SxProps, Theme } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

import { flagIconClasses } from './classes';

// ----------------------------------------------------------------------

type Props = {
  code: string;
  className?: string;
  sx?: SxProps<Theme>;
};

export function FlagIcon({ code, className, sx, ...other }: Props) {
  if (!code) return null;

  return (
    <FlagRoot className={mergeClasses([flagIconClasses.root, className])} sx={sx} {...other}>
      <FlagImg
        loading="lazy"
        alt={code}
        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code.toUpperCase()}.svg`}
        className={flagIconClasses.img}
      />
    </FlagRoot>
  );
}

// ----------------------------------------------------------------------

const FlagRoot = styled('span')(({ theme }) => ({
  width: 26,
  height: 20,
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: '5px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: (theme as any).vars?.palette.background.neutral,
}));

const FlagImg = styled('img')({
  width: '100%',
  height: '100%',
  maxWidth: 'unset',
  objectFit: 'cover',
});
