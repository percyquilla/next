'use client';

import type { ReactNode, FormEventHandler } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

import { FormProvider as RHFForm } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
};

export function Form<T extends FieldValues>({ children, onSubmit, methods }: Props<T>) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {children}
      </form>
    </RHFForm>
  );
}
