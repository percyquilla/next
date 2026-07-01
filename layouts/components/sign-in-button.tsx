import Button from '@mui/material/Button';

import { RouterLink } from '@/lib/routes/components';

import { CONFIG } from '@/lib/global-config';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }) {
  return (
    <Button
      component={RouterLink}
      href={CONFIG.auth.redirectPath}
      variant="outlined"
      sx={sx}
      {...other}
    >
      Sign in
    </Button>
  );
}
