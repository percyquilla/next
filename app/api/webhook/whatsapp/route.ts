import { NextRequest, NextResponse } from 'next/server';

import { addMessage, updateMessage } from '@/lib/message-store';

// ----------------------------------------------------------------------
// GET — Meta webhook verification challenge

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? '', { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

// ----------------------------------------------------------------------
// POST — receive status updates and incoming messages from Meta

export async function POST(request: NextRequest) {
  const body = await request.json();

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;

      // Message status updates: sent → delivered → read
      for (const status of value.statuses ?? []) {
        updateMessage(
          status.recipient_id,
          status.id,
          { status: status.status }
        );
      }

      // Incoming messages from the recipient
      for (const msg of value.messages ?? []) {
        if (msg.type === 'text') {
          addMessage(msg.from, {
            id: msg.id,
            direction: 'in',
            body: msg.text.body,
            status: 'read',
            timestamp: Number(msg.timestamp) * 1000,
          });
        }
      }
    }
  }

  // Meta requires a 200 response quickly
  return NextResponse.json({ status: 'ok' });
}
