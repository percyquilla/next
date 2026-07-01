'use client';

import type { ReactNode, ReactElement, CSSProperties } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import { useTheme } from '@mui/material/styles';

import { NavList } from './nav-list';
import { Nav, NavUl, NavLi } from '../components';
import { navSectionClasses, navSectionCssVars } from '../styles';

// ----------------------------------------------------------------------

type NavItemData = {
  path?: string;
  icon?: ReactNode | string;
  info?: ReactNode | [string, unknown];
  title: string;
  caption?: string;
  disabled?: boolean;
  deepMatch?: boolean;
  allowedRoles?: string[];
  children?: NavItemData[];
};

type NavGroupData = {
  subheader?: string;
  items: NavItemData[];
};

type NavRenderProps = {
  navIcon?: Record<string, ReactNode>;
  navInfo?: (value: unknown) => Record<string, ReactElement>;
};

type NavSectionMiniProps = {
  sx?: SxProps<Theme>;
  data: NavGroupData[];
  render?: NavRenderProps;
  className?: string;
  slotProps?: Record<string, any>;
  checkPermissions?: (allowedRoles?: string[]) => boolean;
  enabledRootRedirect?: boolean;
  cssVars?: CSSProperties;
  [key: string]: unknown;
};

type GroupProps = {
  items: NavItemData[];
  render?: NavRenderProps;
  cssVars?: CSSProperties;
  slotProps?: Record<string, any>;
  checkPermissions?: (allowedRoles?: string[]) => boolean;
  enabledRootRedirect?: boolean;
};

export function NavSectionMini({
  sx,
  data,
  render,
  className,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
  cssVars: overridesVars,
  ...other
}: NavSectionMiniProps) {
  const theme = useTheme();

  const cssVars = { ...navSectionCssVars.mini(theme), ...overridesVars };

  return (
    <Nav
      className={mergeClasses([navSectionClasses.mini, className])}
      sx={[{ ...cssVars }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group) => (
          <Group
            key={group.subheader ?? group.items[0].title}
            render={render}
            cssVars={cssVars}
            items={group.items}
            slotProps={slotProps}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </Nav>
  );
}

// ----------------------------------------------------------------------

function Group({ items, render, cssVars, slotProps, checkPermissions, enabledRootRedirect }: GroupProps) {
  return (
    <NavLi>
      <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
        {items.map((list) => (
          <NavList
            key={list.title}
            depth={1}
            data={list}
            render={render}
            cssVars={cssVars}
            slotProps={slotProps}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </NavLi>
  );
}
