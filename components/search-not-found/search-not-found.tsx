'use client';

import type { SxProps, Theme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  query?: string;
  sx?: SxProps<Theme>;
};

export function SearchNotFound({ query, sx, ...other }: Props) {
  if (!query) {
    return <Typography variant="body2">Ingresa palabras clave</Typography>;
  }

  return (
    <Box
      sx={[
        { gap: 1, display: 'flex', borderRadius: 1.5, textAlign: 'center', flexDirection: 'column' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography variant="h6">Sin resultados</Typography>
      <Typography variant="body2">
        No se encontraron resultados para&nbsp;
        <strong>{`"${query}"`}</strong>.
      </Typography>
    </Box>
  );
}
