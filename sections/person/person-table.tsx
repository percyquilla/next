'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import type { Person } from './view';
import { WhatsAppChat } from './whatsapp-chat';

// ----------------------------------------------------------------------

const AGE_COLOR = (age: number): 'success' | 'info' | 'warning' | 'error' => {
  if (age < 18) return 'info';
  if (age < 40) return 'success';
  if (age < 65) return 'warning';
  return 'error';
};

function stringAvatar(name: string) {
  const parts = name.trim().split(' ');
  const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
  return initials.toUpperCase();
}

function stringToColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

// ----------------------------------------------------------------------

type Props = {
  people: Person[];
  onDelete: (id: string) => void;
};

export function PersonTable({ people, onDelete }: Props) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <>
      <Card>
        <CardHeader
          title="Lista de personas"
          subheader={`${people.length} ${people.length === 1 ? 'persona registrada' : 'personas registradas'}`}
        />

        <Divider />

        {people.length === 0 ? (
          <Stack
            sx={{
              py: 8,
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.disabled',
              gap: 1,
            }}
          >
            <Typography variant="h6">Sin registros</Typography>
            <Typography variant="body2">
              Agrega una persona usando el formulario de arriba.
            </Typography>
          </Stack>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Celular</TableCell>
                  <TableCell>Edad</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {people.map((person, index) => (
                  <TableRow key={person.id} hover>
                    <TableCell sx={{ color: 'text.secondary', width: 48 }}>
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            fontSize: 14,
                            fontWeight: 700,
                            bgcolor: stringToColor(person.name),
                          }}
                        >
                          {stringAvatar(person.name)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {person.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {person.phone}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`${person.age} años`}
                        size="small"
                        color={AGE_COLOR(person.age)}
                        variant="soft"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          variant="soft"
                          onClick={() => setSelectedPerson(person)}
                          sx={{
                            color: '#25D366',
                            borderColor: '#25D366',
                            '&:hover': { bgcolor: '#25D36618' },
                          }}
                        >
                          WhatsApp
                        </Button>

                        <Button
                          size="small"
                          variant="soft"
                          color="error"
                          onClick={() => onDelete(person.id)}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <WhatsAppChat
        open={!!selectedPerson}
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    </>
  );
}
