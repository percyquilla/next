import * as z from 'zod';

// ----------------------------------------------------------------------

export const schemaUtils = {
  phoneNumber: (props?: { error?: { required?: string; invalid?: string } }) =>
    z
      .string()
      .min(1, { error: props?.error?.required ?? 'El celular es requerido' })
      .refine((val) => val.replace(/\D/g, '').length >= 7, {
        error: props?.error?.invalid ?? 'Número de celular inválido',
      }),
};
