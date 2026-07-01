import type { Metadata } from 'next';

import { HomeView } from '@/sections/home/view';
import { DashboardLayout } from '@/layouts/dashboard';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Mi App — Inicio',
};

export default function Page() {
  return (
    <DashboardLayout>
      <HomeView />
    </DashboardLayout>
  );
}
