import type { ReactNode, ReactElement, ReactPortal } from 'react';

import { cloneElement } from 'react';

import { RouterLink } from '@/lib/routes/components';

// ----------------------------------------------------------------------

type NavRenderProps = {
  navIcon?: Record<string, ReactNode>;
  navInfo?: (value: unknown) => Record<string, ReactElement>;
};

type CreateNavItemParams = {
  path?: string;
  icon?: ReactNode | string;
  info?: ReactNode | [string, unknown];
  depth?: number;
  render?: NavRenderProps;
  hasChild?: boolean;
  externalLink?: boolean;
  enabledRootRedirect?: boolean;
};

export function createNavItem({
  path,
  icon,
  info,
  depth,
  render,
  hasChild,
  externalLink,
  enabledRootRedirect,
}: CreateNavItemParams) {
  const rootItem = depth === 1;
  const subItem = !rootItem;
  const subDeepItem = Number(depth) > 2;

  const linkProps = externalLink
    ? { href: path, target: '_blank', rel: 'noopener noreferrer' }
    : { component: RouterLink, href: path };

  const baseProps = hasChild && !enabledRootRedirect ? { component: 'div' } : linkProps;

  /**
   * Render @icon
   */
  let renderIcon: ReactNode = null;

  if (icon && render?.navIcon && typeof icon === 'string') {
    renderIcon = render?.navIcon[icon];
  } else {
    renderIcon = icon as ReactNode;
  }

  /**
   * Render @info
   */
  let renderInfo: ReactNode = null;

  if (info && render?.navInfo && Array.isArray(info)) {
    const [key, value] = info;
    const element = render.navInfo(value)[key];

    renderInfo = element ? cloneElement(element) : null;
  } else {
    renderInfo = info as ReactNode;
  }

  return {
    subItem,
    rootItem,
    subDeepItem,
    baseProps,
    renderIcon,
    renderInfo,
  };
}
