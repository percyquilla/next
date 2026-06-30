import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const SELECT = `
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
`;

export async function GET() {
  try {
    const { rows } = await pool.query(SELECT);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/personas]', err);
    return NextResponse.json({ error: 'Error al obtener personas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nombres, apellidos, nroDocumento, fechaNacimiento, celular, direccion } =
      await req.json();

    const { rows } = await pool.query(
      `INSERT INTO persona.personas
         (id, nombres, apellidos, nro_documento, fecha_nacimiento, celular, direccion, usuario_aut)
       VALUES
         (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'sistema')
       RETURNING
         id::text,
         nombres,
         apellidos,
         nro_documento        AS "nroDocumento",
         TO_CHAR(fecha_nacimiento, 'YYYY-MM-DD') AS "fechaNacimiento",
         COALESCE(celular, '')   AS celular,
         COALESCE(direccion, '') AS direccion,
         estado,
         usuario_aut          AS "usuarioAut"`,
      [nombres, apellidos, nroDocumento, fechaNacimiento, celular || null, direccion || null]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/personas]', err);
    if (err.code === '23505') {
      return NextResponse.json({ error: 'El nro. de documento ya está registrado' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al registrar persona' }, { status: 500 });
  }
}
