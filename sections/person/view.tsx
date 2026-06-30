'use client';

import { useState, useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { PersonForm } from './person-form';
import { PersonTable } from './person-table';

// ----------------------------------------------------------------------

export type Person = {
  id: string;
  nombres: string;
  apellidos: string;
  nroDocumento: string;
  fechaNacimiento: string;
  celular: string;
  direccion: string;
  estado: string;
  usuarioAut: string;
};

type Props = {
  initialPeople: Person[];
};

export function PersonView({ initialPeople }: Props) {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [openAdd, setOpenAdd] = useState(false);

  const handleAdd = useCallback((person: Person) => {
    setPeople((prev) => [person, ...prev]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleEdit = useCallback((updated: Person) => {
    setPeople((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Registro de personas
      </Typography>

      <PersonTable
        people={people}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onOpenAdd={() => setOpenAdd(true)}
      />

      <PersonForm
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={handleAdd}
      />
    </Container>
  );
}
