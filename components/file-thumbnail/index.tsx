'use client';

import Box from '@mui/material/Box';

export function FileThumbnail({ file, sx, ...other }: { file?: string; sx?: any; [key: string]: any }) {
  return (
    <Box
      sx={[{ width: 32, height: 32, borderRadius: 1, bgcolor: 'background.neutral', flexShrink: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    />
  );
}
