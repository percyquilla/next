import type { Metadata } from 'next';

import pool from '@/lib/db';
import { MainLayout } from '@/layouts/main';
import { PersonView } from '@/sections/person/view';
import type { Person } from '@/sections/person/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Registro de Personas',
};

export default async function Page() {
  let initialPeople: Person[] = [];

  try {
    const { rows } = await pool.query(`
      SELECT
        id::text,
        nombres,
        apellidos,
        nro_documento        AS "nroDocumento",
        TO_CHAR(fecha_nacimiento, 'YYYY-MM-DD') AS "fechaNacimiento",
        COALESCE(celular, '')    AS celular,
        COALESCE(direccion, '')  AS direccion,
        estado,
        usuario_aut          AS "usuarioAut"
      FROM persona.personas
      ORDER BY fecha_hora_registro DESC
    `);
    initialPeople = rows;
  } catch (err) {
    console.error('[page /personas] DB error:', err);
  }

  return (
    <MainLayout>
      <PersonView initialPeople={initialPeople} />
    </MainLayout>
  );
}
