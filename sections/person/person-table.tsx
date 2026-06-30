'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from '@/components/iconify';

import type { Person } from './view';
import { WhatsAppChat } from './whatsapp-chat';
import { PersonViewDialog } from './person-view-dialog';
import { PersonEditDialog } from './person-edit-dialog';

// ----------------------------------------------------------------------

function initials(nombres: string, apellidos: string) {
  const n = nombres.trim()[0] ?? '';
  const a = apellidos.trim()[0] ?? '';
  return (n + a).toUpperCase();
}

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

// ----------------------------------------------------------------------

type Props = {
  people: Person[];
  onDelete: (id: string) => void;
  onEdit: (updated: Person) => void;
  onOpenAdd: () => void;
};

export function PersonTable({ people, onDelete, onEdit, onOpenAdd }: Props) {
  const [chatPerson, setChatPerson] = useState<Person | null>(null);
  const [viewPerson, setViewPerson] = useState<Person | null>(null);
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/personas/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? 'Error al eliminar la persona');
        return;
      }
      onDelete(id);
      toast.success('Persona eliminada correctamente');
    } catch {
      toast.error('Error al eliminar la persona');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Lista de personas"
          subheader={`${people.length} ${people.length === 1 ? 'persona registrada' : 'personas registradas'}`}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={onOpenAdd}
            >
              Nueva persona
            </Button>
          }
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
                  <TableCell>Persona</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Nacimiento</TableCell>
                  <TableCell>Celular</TableCell>
                  <TableCell>Estado</TableCell>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            fontSize: 13,
                            fontWeight: 700,
                            bgcolor: stringToColor(person.nombres + person.apellidos),
                          }}
                        >
                          {initials(person.nombres, person.apellidos)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {person.nombres} {person.apellidos}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {person.direccion || '—'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {person.nroDocumento}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatDate(person.fechaNacimiento)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {person.celular || '—'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={person.estado}
                        color={person.estado === 'ACTIVO' ? 'success' : 'default'}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" sx={{ gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => setViewPerson(person)}
                          >
                            <Iconify icon="solar:eye-bold" width={18} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => setEditPerson(person)}
                          >
                            <Iconify icon="solar:pen-2-bold" width={18} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="WhatsApp">
                          <IconButton
                            size="small"
                            onClick={() => setChatPerson(person)}
                            sx={{ color: '#25D366' }}
                          >
                            <Iconify icon="ic:baseline-whatsapp" width={18} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            disabled={deleting === person.id}
                            onClick={() => handleDelete(person.id)}
                          >
                            {deleting === person.id ? (
                              <CircularProgress size={16} color="error" />
                            ) : (
                              <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <PersonViewDialog
        open={!!viewPerson}
        person={viewPerson}
        onClose={() => setViewPerson(null)}
      />

      <PersonEditDialog
        open={!!editPerson}
        person={editPerson}
        onClose={() => setEditPerson(null)}
        onSave={(updated) => {
          onEdit(updated);
          setEditPerson(null);
        }}
      />

      <WhatsAppChat
        open={!!chatPerson}
        person={chatPerson}
        onClose={() => setChatPerson(null)}
      />
    </>
  );
}
