'use client';

import * as z from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Form, Field, schemaUtils } from '@/components/hook-form';

import type { Person } from './view';

// ----------------------------------------------------------------------

export const PersonSchema = z.object({
  nombres: z.string().min(1, { error: 'Los nombres son requeridos' }),
  apellidos: z.string().min(1, { error: 'Los apellidos son requeridos' }),
  nroDocumento: z.string().min(1, { error: 'El nro. de documento es requerido' }),
  fechaNacimiento: z.string().min(1, { error: 'La fecha de nacimiento es requerida' }),
  celular: schemaUtils.phoneNumber(),
  direccion: z.string().min(1, { error: 'La dirección es requerida' }),
});

type PersonFormValues = z.infer<typeof PersonSchema>;

const defaultValues: PersonFormValues = {
  nombres: '',
  apellidos: '',
  nroDocumento: '',
  fechaNacimiento: '',
  celular: '',
  direccion: '',
};

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (person: Person) => void;
};

export function PersonForm({ open, onClose, onAdd }: Props) {
  const [serverError, setServerError] = useState('');

  const methods = useForm<PersonFormValues>({
    resolver: zodResolver(PersonSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setServerError('');
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    setServerError('');

    try {
      const res = await fetch('/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Error al registrar la persona');
      }

      const person: Person = await res.json();
      onAdd(person);
      reset();
      toast.success('Persona registrada correctamente');
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error desconocido');
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar persona</DialogTitle>

      <Divider />

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {serverError && (
              <Alert severity="error" onClose={() => setServerError('')}>
                {serverError}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="nombres" label="Nombres" placeholder="Ej. Juan Carlos" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="apellidos" label="Apellidos" placeholder="Ej. Pérez López" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="nroDocumento" label="Nro. de documento" placeholder="Ej. 12345678" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text
                  name="fechaNacimiento"
                  label="Fecha de nacimiento"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Phone name="celular" label="Celular" defaultCountry="BO" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="direccion" label="Dirección" placeholder="Ej. Av. Siempre Viva 123" />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Registrando..."
          >
            Registrar
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
