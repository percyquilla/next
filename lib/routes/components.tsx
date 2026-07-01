'use client';

import { forwardRef } from 'react';
import NextLink from 'next/link';

export const RouterLink = forwardRef<HTMLAnchorElement, React.ComponentProps<typeof NextLink>>(
  ({ href, ...other }, ref) => <NextLink ref={ref} href={href} {...other} />
);
RouterLink.displayName = 'RouterLink';
