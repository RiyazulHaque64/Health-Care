import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Input } from "@mui/material";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/material/styles";
import { Controller, useFormContext } from "react-hook-form";

type TFileUploaderProps = {
  name: string;
  label?: string;
  sx?: SxProps;
};

export default function FileUploader({ name, label, sx }: TFileUploaderProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => (
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{ ...sx }}
        >
          {label || "Upload file"}
          <Input
            {...field}
            value={value?.fileName}
            onChange={(e) =>
              onChange((e.target as HTMLInputElement).files?.[0])
            }
            type="file"
            sx={{ display: "none" }}
          />
        </Button>
      )}
    />
  );
}
