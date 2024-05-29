import { SxProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

type THDatePickerProps = {
  name: string;
  size?: "small" | "medium";
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  sx?: SxProps;
};
const HDatePicker = ({
  name,
  size = "small",
  label,
  required,
  fullWidth,
  sx,
}: THDatePickerProps) => {
  const { control, formState } = useFormContext();
  const isError = formState.errors[name] !== undefined;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={dayjs(new Date().toDateString())}
      render={({ field: { onChange, value, ...field } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            {...field}
            label={label}
            onChange={(date) => onChange(date)}
            value={value || Date.now()}
            timezone="system"
            disablePast
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

export default HDatePicker;
