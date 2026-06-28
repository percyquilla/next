'use client';

import NextLink from 'next/link';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <Box component="section">
      {/* Hero */}
      <Box
        sx={(theme) => ({
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          mt: 'calc(var(--layout-header-desktop-height) * -1)',
          background: `linear-gradient(135deg, ${(theme as any).vars?.palette.primary.lighter} 0%, ${(theme as any).vars?.palette.background.default} 60%)`,
        })}
      >
        <Container maxWidth="lg">
          <Stack
            sx={{
              maxWidth: 640,
              mx: 'auto',
              textAlign: 'center',
              alignItems: 'center',
              gap: 4,
              py: 10,
            }}
          >
            <Box
              sx={(theme) => ({
                px: 2,
                py: 0.75,
                borderRadius: 10,
                border: `1px solid ${(theme as any).vars?.palette.primary.main}`,
                bgcolor: (theme as any).vars?.palette.primary.lighter,
              })}
            >
              <Typography variant="overline" sx={{ color: 'primary.dark', letterSpacing: 1.5 }}>
                Bienvenido
              </Typography>
            </Box>

            <Typography
              component="h1"
              variant="h2"
              sx={(theme) => ({
                fontWeight: 800,
                lineHeight: 1.2,
                background: `linear-gradient(135deg, ${(theme as any).vars?.palette.text.primary} 30%, ${(theme as any).vars?.palette.primary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              })}
            >
              Gestiona tus registros de personas
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', maxWidth: 480, lineHeight: 1.8 }}
            >
              Una aplicación simple y elegante para registrar personas con nombre y edad.
              Construida con Next.js 16 y MUI v9.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
              <Button
                component={NextLink}
                href="/personas"
                variant="contained"
                size="large"
                sx={{ px: 4, height: 52, borderRadius: 2 }}
              >
                Registrar personas
              </Button>

              <Button
                component={NextLink}
                href="/personas"
                variant="outlined"
                size="large"
                sx={{ px: 4, height: 52, borderRadius: 2 }}
              >
                Ver lista
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Features section */}
      <Box sx={{ py: 12, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ textAlign: 'center', mb: 8, fontWeight: 700 }}
          >
            ¿Qué puedes hacer?
          </Typography>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{ gap: 4 }}
          >
            {FEATURES.map((feature) => (
              <Box
                key={feature.title}
                sx={(theme) => ({
                  flex: 1,
                  p: 4,
                  borderRadius: 3,
                  border: `1px solid ${(theme as any).vars?.palette.divider}`,
                  textAlign: 'center',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  '&:hover': {
                    boxShadow: (theme as any).vars?.customShadows?.z16,
                    transform: 'translateY(-4px)',
                  },
                })}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'primary.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    fontSize: 28,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

const FEATURES = [
  {
    icon: '📝',
    title: 'Registrar',
    description: 'Agrega personas con nombre y edad de forma rápida y sencilla con validación en tiempo real.',
  },
  {
    icon: '📋',
    title: 'Listar',
    description: 'Visualiza todas las personas registradas en una tabla organizada con avatares y etiquetas de edad.',
  },
  {
    icon: '🗑️',
    title: 'Eliminar',
    description: 'Elimina registros que ya no necesitas con un solo clic desde la tabla de personas.',
  },
];
