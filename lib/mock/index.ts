export const _mock = {
  fullName: (index: number) => ['Ana García', 'Carlos López', 'María Martínez'][index - 1] ?? `User ${index}`,
  image: {
    avatar: (_index: number) => '',
  },
};

export const _contacts = [
  { id: '1', name: 'Ana García', avatarUrl: '', status: 'online', lastActivity: new Date() },
  { id: '2', name: 'Carlos López', avatarUrl: '', status: 'offline', lastActivity: new Date(Date.now() - 3600000) },
];

export const _notifications = [
  {
    id: '1',
    title: 'Bienvenido a la aplicación',
    category: 'Sistema',
    createdAt: new Date(),
    isUnRead: true,
    type: 'mail',
    avatarUrl: '',
  },
];
