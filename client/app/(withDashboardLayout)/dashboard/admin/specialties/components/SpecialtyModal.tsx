import FileUploader from "@/app/components/Forms/FileUploader";
import Form from "@/app/components/Forms/Form";
import Input from "@/app/components/Forms/Input";
import Modal from "@/app/components/Shared/Modal/Modal";
import { useCreateSpecilitiesMutation } from "@/app/redux/api/specialitiesApi";
import convertPayloadToFormData from "@/app/utils/convertPayloadToFormData";
import { Button, Grid } from "@mui/material";
import React from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SpecialtyModal = ({ open, setOpen }: TProps) => {
  const [createSpecialities] = useCreateSpecilitiesMutation();

  const handleFormSubmit = async (values: FieldValues) => {
    const convertedData = convertPayloadToFormData(values);
    console.dir(convertedData, { depth: Infinity });
    try {
      const res = await createSpecialities(convertedData).unwrap();
      console.log(res);
      if (res?.success) {
        toast.success("Specialty created successfully");
        setOpen(false);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <Modal open={open} setOpen={setOpen} title="Create Specialty">
      <Form
        onSubmit={handleFormSubmit}
        defaultValues={{
          title: "",
        }}
      >
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Input name="title" label="Title" />
          </Grid>
          <Grid item md={6}>
            <FileUploader name="icon" label="Upload Icon" />
          </Grid>
        </Grid>
        <Button sx={{ mt: 1 }} type="submit">
          Create
        </Button>
      </Form>
    </Modal>
  );
};

export default SpecialtyModal;
