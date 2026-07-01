'use client';

import { useSession } from 'next-auth/react';

export function useCurrentUser() {
  const { data: session } = useSession();

  if (!session?.user) return { user: null };

  const u = session.user;

  return {
    user: {
      // Keycloak envía el nombre completo en name, y el email en email
      displayName: u.name ?? u.email?.split('@')[0] ?? 'Usuario',
      email: u.email ?? '',
      // Keycloak puede enviar foto de perfil; si no, queda vacío y el Avatar muestra la inicial
      photoURL: u.image ?? '',
      role: 'admin',
    },
  };
}

// Alias para compatibilidad con archivos copiados del template
export const useMockedUser = useCurrentUser;
