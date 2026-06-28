'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const FooterRoot = styled('footer')(({ theme }) => ({
  position: 'relative',
  backgroundColor: (theme as any).vars?.palette.background.default,
}));

export function HomeFooter({ sx, ...other }: { sx?: any }) {
  return (
    <FooterRoot
      sx={[
        { py: 5, textAlign: 'center' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Divider sx={{ mb: 5 }} />
      <Container>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Box
            component="span"
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: 'primary.main',
              display: 'inline-block',
            }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Mi App
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.disabled' }}>
          © {new Date().getFullYear()} Mi App. Todos los derechos reservados.
        </Typography>
      </Container>
    </FooterRoot>
  );
}
