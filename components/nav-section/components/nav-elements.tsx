import type { HTMLAttributes, HTMLProps } from 'react';

import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

import { navSectionClasses } from '../styles';

// ----------------------------------------------------------------------

export const Nav = styled('nav')``;

// ----------------------------------------------------------------------

type NavLiProps = HTMLAttributes<HTMLLIElement> & { disabled?: boolean; sx?: any };

export const NavLi = styled(
  ({ children, className, ...props }: NavLiProps) => (
    <li {...props} className={mergeClasses([navSectionClasses.li, className])}>
      {children}
    </li>
  ),
  { shouldForwardProp: (prop) => !['disabled', 'sx'].includes(prop as string) }
)<NavLiProps>(() => ({
  display: 'inline-block',
  variants: [{ props: { disabled: true }, style: { cursor: 'not-allowed' } }],
}));

// ----------------------------------------------------------------------

type NavUlProps = HTMLAttributes<HTMLUListElement> & { sx?: any };

export const NavUl = styled(({ children, className, ...props }: NavUlProps) => (
  <ul {...props} className={mergeClasses([navSectionClasses.ul, className])}>
    {children}
  </ul>
))(() => ({ display: 'flex', flexDirection: 'column' }));
