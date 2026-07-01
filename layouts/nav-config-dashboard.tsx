import { Iconify } from '@/components/iconify';

import { paths } from '@/lib/routes/paths';

// ----------------------------------------------------------------------

const ICONS = {
  dashboard: <Iconify icon="solar:home-angle-bold-duotone" width={24} />,
  personas: <Iconify icon="solar:users-group-rounded-bold-duotone" width={24} />,
};

// ----------------------------------------------------------------------
export const navData = [
  {
    subheader: 'General',
    items: [
      { title: 'Inicio', path: paths.root, icon: ICONS.dashboard },
      { title: 'Personas', path: paths.personas, icon: ICONS.personas },
    ],
  },
];
