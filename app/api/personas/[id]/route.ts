import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const RETURNING = `
  RETURNING
    id::text,
    nombres,
    apellidos,
    nro_documento        AS "nroDocumento",
    TO_CHAR(fecha_nacimiento, 'YYYY-MM-DD') AS "fechaNacimiento",
    COALESCE(celular, '')   AS celular,
    COALESCE(direccion, '') AS direccion,
    estado,
    usuario_aut          AS "usuarioAut"
`;

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { nombres, apellidos, nroDocumento, fechaNacimiento, celular, direccion, estado } =
      await req.json();

    const { rows } = await pool.query(
      `UPDATE persona.personas
       SET nombres=$1, apellidos=$2, nro_documento=$3,
           fecha_nacimiento=$4, celular=$5, direccion=$6, estado=$7
       WHERE id=$8
       ${RETURNING}`,
      [nombres, apellidos, nroDocumento, fechaNacimiento, celular || null, direccion || null, estado, id]
    );

    if (!rows.length) {
      return NextResponse.json({ error: 'Persona no encontrada' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err: any) {
    console.error('[PUT /api/personas]', err);
    if (err.code === '23505') {
      return NextResponse.json({ error: 'El nro. de documento ya está registrado' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al actualizar persona' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM persona.personas WHERE id = $1', [id]);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[DELETE /api/personas]', err);
    return NextResponse.json({ error: 'Error al eliminar persona' }, { status: 500 });
  }
}
