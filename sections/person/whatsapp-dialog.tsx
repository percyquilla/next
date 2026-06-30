'use client';

import { useState } from 'react';

import type { Theme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { sendWhatsAppMessage } from '@/actions/whatsapp';

import type { Person } from './view';

// ----------------------------------------------------------------------

type SendState = 'idle' | 'loading' | 'success' | 'error';

type Props = {
  open: boolean;
  person: Person | null;
  onClose: () => void;
};

export function WhatsAppDialog({ open, person, onClose }: Props) {
  const [message, setMessage] = useState('');
  const [sendState, setSendState] = useState<SendState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    if (sendState === 'loading') return;
    setMessage('');
    setSendState('idle');
    setErrorMsg('');
    onClose();
  };

  const handleSend = async () => {
    if (!message.trim() || !person) return;

    setSendState('loading');
    setErrorMsg('');

    const result = await sendWhatsAppMessage(person.celular, message);

    if (result.success) {
      setSendState('success');
      setMessage('');
    } else {
      setErrorMsg(result.error);
      setSendState('error');
    }
  };

  if (!person) return null;

  const isSending = sendState === 'loading';

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* WhatsApp green icon */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            💬
          </Box>
          Enviar por WhatsApp
        </Box>

        <IconButton size="small" onClick={handleClose} disabled={isSending}>
          ✕
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Recipient info */}
        <Box
          sx={(theme) => ({
            p: 2,
            mb: 3,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: (theme as Theme & { vars?: { palette?: { background?: { neutral?: string } } } }).vars?.palette?.background?.neutral ?? 'action.hover',
          })}
        >
          <Avatar sx={{ bgcolor: '#25D366', color: '#fff', fontWeight: 700 }}>
            {person.nombres.trim()[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{person.nombres} {person.apellidos}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {person.celular}
            </Typography>
          </Box>
        </Box>

        {/* Message field */}
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={8}
          label="Mensaje"
          placeholder={`Hola ${person.nombres.split(' ')[0]}, ...`}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (sendState === 'error') setSendState('idle');
          }}
          disabled={isSending || sendState === 'success'}
          helperText={`${message.length} / 4096 caracteres`}
          slotProps={{ htmlInput: { maxLength: 4096 } }}
        />

        {/* Feedback alerts */}
        {sendState === 'success' && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Mensaje enviado correctamente.
          </Alert>
        )}
        {sendState === 'error' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMsg}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={handleClose} disabled={isSending} color="inherit">
          {sendState === 'success' ? 'Cerrar' : 'Cancelar'}
        </Button>

        {sendState !== 'success' && (
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={isSending || !message.trim()}
            startIcon={
              isSending ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <span>📤</span>
              )
            }
            sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1ebe5d' } }}
          >
            {isSending ? 'Enviando...' : 'Enviar mensaje'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
