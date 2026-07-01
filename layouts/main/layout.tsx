'use client';

import type { ReactNode } from 'react';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { LayoutSection, HeaderSection, MainSection } from '@/layouts/core';
import { HomeFooter } from './footer';

// ----------------------------------------------------------------------

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Personas', href: '/personas' },
];

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export function MainLayout({ children }: Props) {
  const pathname = usePathname();

  const renderHeader = () => (
    <HeaderSection
      slots={{
        leftArea: (
          <Box
            component={NextLink}
            href="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: 'primary.main',
                flexShrink: 0,
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: 'text.primary', display: { xs: 'none', sm: 'block' } }}
            >
              Mi App
            </Typography>
          </Box>
        ),
        centerArea: (
          <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                component={NextLink}
                href={link.href}
                underline="none"
                sx={{
                  typography: 'body2',
                  fontWeight: 600,
                  color: pathname === link.href ? 'primary.main' : 'text.primary',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        ),
        rightArea: (
          <Button
            component={NextLink}
            href="/personas"
            variant="contained"
            size="small"
          >
            Registrar persona
          </Button>
        ),
      }}
    />
  );

  return (
    <LayoutSection
      headerSection={renderHeader()}
      footerSection={<HomeFooter />}
    >
      <MainSection>{children}</MainSection>
    </LayoutSection>
  );
}
