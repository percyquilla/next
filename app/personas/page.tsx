import type { Metadata } from 'next';

import { PersonView } from '@/sections/person/view';
import { MainLayout } from '@/layouts/main';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Registro de Personas',
};

export default function Page() {
  return (
    <MainLayout>
      <PersonView />
    </MainLayout>
  );
}
