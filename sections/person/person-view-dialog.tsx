'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import type { Person } from './view';

// ----------------------------------------------------------------------

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

function formatDate(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.25, fontWeight: 500 }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  person: Person | null;
  onClose: () => void;
};

export function PersonViewDialog({ open, person, onClose }: Props) {
  if (!person) return null;

  const fullName = `${person.nombres} ${person.apellidos}`;
  const initials = (person.nombres[0] ?? '') + (person.apellidos[0] ?? '');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 52,
              height: 52,
              fontSize: 18,
              fontWeight: 700,
              bgcolor: stringToColor(fullName),
            }}
          >
            {initials.toUpperCase()}
          </Avatar>

          <Box>
            <Box
              component="span"
              sx={{ display: 'block', fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.3 }}
            >
              {fullName}
            </Box>
            <Chip
              size="small"
              label={person.estado}
              color={person.estado === 'ACTIVO' ? 'success' : 'default'}
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="Nro. de documento" value={person.nroDocumento} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="Fecha de nacimiento" value={formatDate(person.fechaNacimiento)} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="Celular" value={person.celular} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="Usuario autorizador" value={person.usuarioAut} />
          </Grid>

          <Grid size={12}>
            <InfoRow label="Dirección" value={person.direccion} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
