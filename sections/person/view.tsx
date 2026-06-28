'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { PersonForm } from './person-form';
import { PersonTable } from './person-table';

// ----------------------------------------------------------------------

export type Person = {
  id: string;
  name: string;
  age: number;
};

export function PersonView() {
  const [people, setPeople] = useState<Person[]>([]);

  const handleAdd = useCallback((name: string, age: number) => {
    setPeople((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, age },
    ]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Registro de personas</Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Ingresa el nombre y la edad para agregar personas a la lista.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <PersonForm onAdd={handleAdd} />
        <PersonTable people={people} onDelete={handleDelete} />
      </Box>
    </Container>
  );
}
