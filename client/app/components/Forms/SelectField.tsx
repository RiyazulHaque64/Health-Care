import { MenuItem, SxProps, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type TInputTypes = {
  name: string;
  label?: string;
  size?: "small" | "medium";
  placeholder?: string;
  fullWidth?: boolean;
  required?: boolean;
  sx?: SxProps;
  items: string[];
};

const SelectField = ({
  items,
  name,
  label,
  size = "small",
  fullWidth,
  required,
  sx,
}: TInputTypes) => {
  const { control, formState } = useFormContext();
  const isError = formState.errors["name"] !== undefined;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
          {...field}
          sx={{ ...sx }}
          label={label}
          select
          size={size}
          fullWidth={fullWidth}
          required={required}
          placeholder={label}
          error={isError}
          helperText={
            isError ? (formState.errors["name"]?.message as string) : ""
          }
        >
          {items.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default SelectField;
