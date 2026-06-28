'use server';

import axios, { AxiosError } from 'axios';

import { addMessage, updateMessage } from '@/lib/message-store';

const GRAPH_API_VERSION = 'v25.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// ----------------------------------------------------------------------

type SendResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

export async function sendWhatsAppMessage(to: string, message: string): Promise<SendResult> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    return { success: false, error: 'Credenciales de WhatsApp no configuradas en el servidor.' };
  }

  if (!to || !message.trim()) {
    return { success: false, error: 'El número y el mensaje son requeridos.' };
  }

  const normalized = to.replace(/[\s\-()]/g, '');

  // Save with a temp ID so the UI shows it immediately as "sending"
  const tempId = `temp_${Date.now()}`;
  addMessage(normalized, {
    id: tempId,
    direction: 'out',
    body: message.trim(),
    status: 'sending',
    timestamp: Date.now(),
  });

  try {
    const { data } = await axios.post(
      `${GRAPH_API_BASE}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: normalized,
        type: 'text',
        text: {
          preview_url: false,
          body: message.trim(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const wamid: string = data?.messages?.[0]?.id ?? tempId;

    // Replace temp ID with the real wamid and mark as sent
    updateMessage(normalized, tempId, { id: wamid, status: 'sent' });

    return { success: true, messageId: wamid };
  } catch (err) {
    const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
    const errorMsg =
      axiosErr.response?.data?.error?.message ??
      axiosErr.message ??
      'Error al enviar el mensaje.';

    updateMessage(normalized, tempId, { status: 'failed' });

    return { success: false, error: errorMsg };
  }
}
