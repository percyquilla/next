'use client';

import { useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';

import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

export function SignOutButton({ onClose, sx, ...other }: { onClose?: () => void; sx?: any; [key: string]: any }) {
  const { data: session } = useSession();

  const handleLogout = useCallback(async () => {
    onClose?.();

    const idToken = (session as any)?.idToken as string | undefined;
    const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;

    // Debug: confirma que llegamos aquí con los valores correctos
    console.log('[logout] idToken:', idToken ? '✓ presente' : '✗ undefined');
    console.log('[logout] issuer:', issuer ?? '✗ undefined');

    // Cierra la sesión de next-auth sin redirigir aún
    await signOut({ redirect: false });

    if (idToken && issuer) {
      // post_logout_redirect_uri debe ser exactamente uno de los URIs
      // registrados en Keycloak (en el cliente: "http://localhost:3000/")
      // El proxy redirigirá automáticamente a /login al no haber sesión.
      const logoutUrl = new URL(`${issuer}/protocol/openid-connect/logout`);
      logoutUrl.searchParams.set('id_token_hint', idToken);
      logoutUrl.searchParams.set('post_logout_redirect_uri', window.location.origin + '/');

      console.log('[logout] URL Keycloak:', logoutUrl.toString());
      window.location.href = logoutUrl.toString();
    } else {
      // Fallback: si no hay idToken o issuer, solo redirige a login
      console.warn('[logout] Sin idToken o issuer, redirigiendo a /login directamente');
      window.location.href = '/login';
    }
  }, [onClose, session]);

  return (
    <Button
      fullWidth
      variant="outlined"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      Cerrar sesión
    </Button>
  );
}
