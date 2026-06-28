export * from './context';
export * from './settings-config';
// Note: do NOT re-export server.ts here — it uses next/headers (server-only).
// Import detectSettings directly: import { detectSettings } from '@/components/settings/server'
