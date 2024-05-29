import { SxProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

type THTimePickerProps = {
  name: string;
  size?: "small" | "medium";
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  sx?: SxProps;
};
const HTimePicker = ({
  name,
  size = "small",
  label,
  required,
  fullWidth,
  sx,
}: THTimePickerProps) => {
  const { control, formState } = useFormContext();
  const isError = formState.errors[name] !== undefined;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={dayjs(new Date().toDateString())}
      render={({ field: { onChange, value, ...field } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            {...field}
            label={label}
            onChange={(time) => onChange(time)}
            value={value || Date.now()}
            timezone="system"
            slotProps={{
              textField: {
                required: required,
                size: size,
                sx: { ...sx },
                variant: "outlined",
                fullWidth,
                error: isError,
                helperText: isError
                  ? (formState.errors[name]?.message as string)
                  : "",
              },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default HTimePicker;
