'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

// ----------------------------------------------------------------------

type FormValues = {
  name: string;
  age: string;
  phone: string;
};

type FormErrors = Partial<FormValues>;

type Props = {
  onAdd: (name: string, age: number, phone: string) => void;
};

export function PersonForm({ onAdd }: Props) {
  const [values, setValues] = useState<FormValues>({ name: '', age: '', phone: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!values.name.trim()) {
      next.name = 'El nombre es requerido';
    }
    const ageNum = Number(values.age);
    if (!values.age) {
      next.age = 'La edad es requerida';
    } else if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) {
      next.age = 'Ingresa una edad válida (1 – 120)';
    }
    if (!values.phone.trim()) {
      next.phone = 'El celular es requerido';
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(values.phone.trim())) {
      next.phone = 'Ingresa un número válido';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd(values.name.trim(), Number(values.age), values.phone.trim());
    setValues({ name: '', age: '', phone: '' });
    setErrors({});
  };

  return (
    <Card>
      <CardHeader
        title="Agregar persona"
        subheader="Completa los campos para registrar una nueva persona"
      />

      <Divider />

      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <TextField
            fullWidth
            label="Nombre"
            placeholder="Ej. Juan Pérez"
            value={values.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Edad"
                placeholder="Ej. 25"
                type="number"
                value={values.age}
                onChange={handleChange('age')}
                error={!!errors.age}
                helperText={errors.age}
                slotProps={{ htmlInput: { min: 1, max: 120 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Número de celular"
                placeholder="Ej. +51 987 654 321"
                type="tel"
                value={values.phone}
                onChange={handleChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
          </Grid>

          <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" size="large">
              Agregar
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
