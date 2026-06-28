import { NextRequest, NextResponse } from 'next/server';

import { getMessages } from '@/lib/message-store';

export async function GET(request: NextRequest) {
  const phone = new URL(request.url).searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'phone requerido' }, { status: 400 });
  }

  return NextResponse.json({ messages: getMessages(phone) });
}
