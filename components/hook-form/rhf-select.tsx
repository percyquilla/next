import type { TextFieldProps } from '@mui/material/TextField';
import type { ReactNode } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

type RHFSelectProps = TextFieldProps & {
  name: string;
  children: ReactNode;
};

export function RHFSelect({ name, children, helperText, slotProps, ...other }: RHFSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          error={!!error}
          helperText={error?.message ?? helperText}
          slotProps={slotProps}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}
