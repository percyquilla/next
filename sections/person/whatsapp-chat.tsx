'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { sendWhatsAppMessage } from '@/actions/whatsapp';

import type { Person } from './view';

// ----------------------------------------------------------------------

type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

type ChatMessage = {
  id: string;
  direction: 'out' | 'in';
  body: string;
  status: MessageStatus;
  timestamp: number;
};

// ----------------------------------------------------------------------

function StatusTick({ status }: { status: MessageStatus }) {
  if (status === 'sending') {
    return (
      <CircularProgress
        size={10}
        sx={{ ml: 0.5, color: 'primary.contrastText', opacity: 0.6 }}
      />
    );
  }
  if (status === 'failed') {
    return (
      <Typography component="span" sx={{ fontSize: 11, ml: 0.5, color: 'error.main' }}>
        ✕
      </Typography>
    );
  }
  const text = status === 'sent' ? '✓' : '✓✓';
  const color = status === 'read' ? 'info.main' : 'primary.contrastText';
  const opacity = status === 'read' ? 1 : 0.7;
  return (
    <Typography component="span" sx={{ fontSize: 11, ml: 0.5, color, opacity }}>
      {text}
    </Typography>
  );
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  person: Person | null;
  onClose: () => void;
};

const POLL_INTERVAL = 3000;

export function WhatsAppChat({ open, person, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!person) return;
    try {
      const res = await fetch(`/api/messages?phone=${encodeURIComponent(person.phone)}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
    } catch {
      // silently ignore network errors on poll
    }
  }, [person]);

  useEffect(() => {
    if (!open || !person) return;
    fetchMessages();
    const id = setInterval(fetchMessages, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [open, person, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !person || sending) return;

    setInput('');
    setError('');
    setSending(true);

    const optimistic: ChatMessage = {
      id: `opt_${Date.now()}`,
      direction: 'out',
      body: text,
      status: 'sending',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, optimistic]);

    const result = await sendWhatsAppMessage(person.phone, text);

    if (!result.success) {
      setError(result.error);
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...m, status: 'failed' } : m))
      );
    }

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setMessages([]);
    setInput('');
    setError('');
    onClose();
  };

  if (!person) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { height: '80vh', display: 'flex', flexDirection: 'column' } } }}
    >
      {/* ── Header ── */}
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={(theme) => ({
            px: 2,
            py: 1.5,
            gap: 1.5,
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            boxShadow: theme.customShadows.z8,
          })}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              fontSize: 15,
              fontWeight: 700,
              bgcolor: 'primary.dark',
              color: 'primary.contrastText',
            }}
          >
            {person.name.trim()[0].toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {person.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.72 }}>
              {person.phone}
            </Typography>
          </Box>

          <Tooltip title="Actualiza cada 3 s">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.7 }}>
              <CircularProgress size={10} color="inherit" />
              <Typography variant="caption">en vivo</Typography>
            </Box>
          </Tooltip>

          <IconButton size="small" onClick={handleClose} color="inherit">
            ✕
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      {/* ── Message list ── */}
      <DialogContent
        sx={(theme) => ({
          flex: 1,
          p: 2,
          gap: 1,
          display: 'flex',
          overflowY: 'auto',
          flexDirection: 'column',
          bgcolor: varAlpha(theme.vars?.palette.primary.mainChannel ?? '', 0.04),
        })}
      >
        {messages.length === 0 && (
          <Box sx={{ m: 'auto', textAlign: 'center', color: 'text.disabled' }}>
            <Typography variant="body2">Sin mensajes aún.</Typography>
            <Typography variant="caption">Escribe para comenzar la conversación.</Typography>
          </Box>
        )}

        {messages.map((msg) => {
          const isOut = msg.direction === 'out';
          return (
            <Box
              key={msg.id}
              sx={{ display: 'flex', justifyContent: isOut ? 'flex-end' : 'flex-start' }}
            >
              <Box
                sx={(theme) => ({
                  maxWidth: '72%',
                  px: 1.5,
                  pt: 1,
                  pb: 0.5,
                  borderRadius: isOut ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  bgcolor: isOut ? 'primary.main' : 'background.paper',
                  color: isOut ? 'primary.contrastText' : 'text.primary',
                  boxShadow: theme.customShadows.z1,
                })}
              >
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                >
                  {msg.body}
                </Typography>

                <Box
                  sx={{
                    mt: 0.25,
                    gap: 0.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 10,
                      color: isOut ? 'primary.contrastText' : 'text.disabled',
                      opacity: isOut ? 0.65 : 1,
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </Typography>
                  {isOut && <StatusTick status={msg.status} />}
                </Box>
              </Box>
            </Box>
          );
        })}

        <div ref={bottomRef} />
      </DialogContent>

      {/* ── Error banner ── */}
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ borderRadius: 0 }}>
          {error}
        </Alert>
      )}

      {/* ── Input bar ── */}
      <Box
        sx={{
          px: 1.5,
          py: 1,
          gap: 1,
          display: 'flex',
          alignItems: 'flex-end',
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.neutral',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder="Escribe un mensaje…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'background.paper',
            },
          }}
        />

        <IconButton
          onClick={handleSend}
          disabled={!input.trim() || sending}
          sx={{
            width: 42,
            height: 42,
            flexShrink: 0,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
          }}
        >
          {sending ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <span style={{ fontSize: 18 }}>➤</span>
          )}
        </IconButton>
      </Box>
    </Dialog>
  );
}
