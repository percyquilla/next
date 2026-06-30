'use client';

import type { CountryCode } from 'libphonenumber-js';

import { Controller, useFormContext } from 'react-hook-form';

import { PhoneInput } from '@/components/phone-input';

// ----------------------------------------------------------------------

type RHFPhoneInputProps = {
  name: string;
  label?: string;
  helperText?: string;
  defaultCountry?: CountryCode;
  [key: string]: unknown;
};

export function RHFPhoneInput({ name, helperText, ...other }: RHFPhoneInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PhoneInput
          {...field}
          fullWidth
          onChange={(val) => field.onChange(val ?? '')}
          error={!!error}
          helperText={error?.message ?? helperText}
          {...other}
        />
      )}
    />
  );
}
