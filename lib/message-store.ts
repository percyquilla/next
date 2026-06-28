import 'server-only';

// ----------------------------------------------------------------------

export type MessageDirection = 'out' | 'in';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type ChatMessage = {
  id: string;
  direction: MessageDirection;
  body: string;
  status: MessageStatus;
  timestamp: number;
};

// Global singleton — survives HMR in dev, persists within a Cloud Run instance.
// Note: data resets on cold start / new instance. Add a DB for persistence.
const g = global as typeof globalThis & {
  __whatsappStore?: Map<string, ChatMessage[]>;
};

if (!g.__whatsappStore) {
  g.__whatsappStore = new Map();
}

const store = g.__whatsappStore;

// ----------------------------------------------------------------------

function normalize(phone: string) {
  return phone.replace(/[\s\-()]/g, '');
}

export function getMessages(phone: string): ChatMessage[] {
  return store.get(normalize(phone)) ?? [];
}

export function addMessage(phone: string, msg: ChatMessage): void {
  const key = normalize(phone);
  store.set(key, [...(store.get(key) ?? []), msg]);
}

export function updateMessage(phone: string, id: string, patch: Partial<ChatMessage>): void {
  const key = normalize(phone);
  const msgs = store.get(key);
  if (!msgs) return;
  store.set(
    key,
    msgs.map((m) => (m.id === id ? { ...m, ...patch } : m))
  );
}
