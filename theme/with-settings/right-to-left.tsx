'use client';

import { useEffect } from 'react';

// ----------------------------------------------------------------------

type Props = {
  direction?: 'ltr' | 'rtl';
  children: React.ReactNode;
};

/**
 * Sets document.dir for RTL support.
 * To enable full RTL with emotion, install @mui/stylis-plugin-rtl and
 * wrap children with a CacheProvider using the rtlPlugin.
 */
export function Rtl({ children, direction = 'ltr' }: Props) {
  useEffect(() => {
    document.dir = direction;
  }, [direction]);

  return <>{children}</>;
}
