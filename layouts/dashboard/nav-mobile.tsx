import { useEffect } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import { usePathname } from '@/lib/routes/hooks';

import { Logo } from '@/components/logo';
import { Scrollbar } from '@/components/scrollbar';
import { NavSectionVertical } from '@/components/nav-section';

import { layoutClasses } from '@/layouts/core';
import { NavUpgrade } from '@/layouts/components/nav-upgrade';

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  className,
  checkPermissions,
  ...other
}: { sx?: any; data?: any; open?: boolean; slots?: any; onClose?: () => void; className?: string; checkPermissions?: any; cssVars?: any; [key: string]: any }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className: mergeClasses([layoutClasses.nav.root, layoutClasses.nav.vertical, className]),
          sx: [
            {
              overflow: 'unset',
              bgcolor: 'var(--layout-nav-bg)',
              width: 'var(--layout-nav-mobile-width)',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ],
        },
      }}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          <Logo />
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical
          data={data}
          checkPermissions={checkPermissions}
          sx={{ px: 2, flex: '1 1 auto' }}
          {...other}
        />
        <NavUpgrade />
      </Scrollbar>

      {slots?.bottomArea}
    </Drawer>
  );
}
