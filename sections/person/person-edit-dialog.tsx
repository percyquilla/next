'use client';

import * as z from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Form, Field, schemaUtils } from '@/components/hook-form';

import type { Person } from './view';

// ----------------------------------------------------------------------

const EditSchema = z.object({
  nombres: z.string().min(1, { error: 'Requerido' }),
  apellidos: z.string().min(1, { error: 'Requerido' }),
  nroDocumento: z.string().min(1, { error: 'Requerido' }),
  fechaNacimiento: z.string().min(1, { error: 'Requerido' }),
  celular: schemaUtils.phoneNumber({ error: { required: 'Requerido' } }),
  direccion: z.string().min(1, { error: 'Requerido' }),
  estado: z.string().min(1, { error: 'Requerido' }),
});

type EditFormValues = z.infer<typeof EditSchema>;

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  person: Person | null;
  onClose: () => void;
  onSave: (updated: Person) => void;
};

export function PersonEditDialog({ open, person, onClose, onSave }: Props) {
  const methods = useForm<EditFormValues>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      nombres: '',
      apellidos: '',
      nroDocumento: '',
      fechaNacimiento: '',
      celular: '',
      direccion: '',
      estado: 'ACTIVO',
    },
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (person) {
      reset({
        nombres: person.nombres,
        apellidos: person.apellidos,
        nroDocumento: person.nroDocumento,
        fechaNacimiento: person.fechaNacimiento,
        // PhoneInput requires E.164 format; leave empty if value lacks + prefix
        celular: person.celular?.startsWith('+') ? person.celular : '',
        direccion: person.direccion,
        estado: person.estado,
      });
    }
  }, [person, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await fetch(`/api/personas/${person!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Error al actualizar');
      }

      const updated: Person = await res.json();
      onSave(updated);
      toast.success('Persona actualizada correctamente');
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Error desconocido',
      });
    }
  });

  if (!person) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Editar persona
        <Box
          component="span"
          sx={{ display: 'block', typography: 'body2', color: 'text.secondary', mt: 0.25 }}
        >
          {person.nombres} {person.apellidos}
        </Box>
      </DialogTitle>

      <Divider />

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {errors.root && (
              <Alert severity="error" onClose={() => methods.clearErrors('root')}>
                {errors.root.message}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="nombres" label="Nombres" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="apellidos" label="Apellidos" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="nroDocumento" label="Nro. de documento" />
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
                <Field.Select name="estado" label="Estado">
                  <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                  <MenuItem value="INACTIVO">INACTIVO</MenuItem>
                </Field.Select>
              </Grid>

              <Grid size={12}>
                <Field.Text name="direccion" label="Dirección" />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Guardando..."
          >
            Guardar cambios
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
