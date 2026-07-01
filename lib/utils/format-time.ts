export function fToNow(date: Date | string | number): string {
  const d = new Date(date);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 60) return 'Ahora mismo';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

export function fDate(date: Date | string | number, format?: string): string {
  return new Date(date).toLocaleDateString('es', { year: 'numeric', month: 'short', day: 'numeric' });
}
