import type { FormHelperTextProps } from '@mui/material/FormHelperText';

import FormHelperText from '@mui/material/FormHelperText';

// ----------------------------------------------------------------------

type HelperTextProps = FormHelperTextProps & {
  helperText?: string;
  errorMessage?: string;
  disableGutters?: boolean;
};

export function HelperText({
  sx,
  helperText,
  errorMessage,
  disableGutters = false,
  ...other
}: HelperTextProps) {
  const message = errorMessage ?? helperText;

  if (!message) return null;

  return (
    <FormHelperText
      error={!!errorMessage}
      sx={[{ mx: disableGutters ? 0 : 1.5 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {errorMessage || helperText}
    </FormHelperText>
  );
}
