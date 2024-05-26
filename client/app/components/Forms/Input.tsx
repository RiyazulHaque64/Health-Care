"use client";

import { SxProps, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type TInputTypes = {
  name: string;
  label?: string;
  type?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  required?: boolean;
  sx?: SxProps;
};

const Input = ({
  name,
  label,
  type = "text",
  size = "small",
  fullWidth,
  required,
  sx,
}: TInputTypes) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          sx={{ ...sx }}
          label={label}
          type={type}
          size={size}
          fullWidth={fullWidth}
          required={required}
          placeholder={label}
          error={!!error?.message}
          helperText={error?.message}
        />
      )}
    />
  );
};

export default Input;
