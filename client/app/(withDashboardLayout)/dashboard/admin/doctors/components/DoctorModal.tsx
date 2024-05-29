import Form from "@/app/components/Forms/Form";
import Input from "@/app/components/Forms/Input";
import SelectField from "@/app/components/Forms/SelectField";
import FullScreenModal from "@/app/components/Shared/Modal/FullScreenModal";
import { gender } from "@/app/constants/common";
import { useCreateDoctorMutation } from "@/app/redux/api/doctorsApi";
import convertPayloadToFormData from "@/app/utils/convertPayloadToFormData";
import { Button, Grid, Stack } from "@mui/material";
import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

type TDoctorModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValues = {
  password: "",
  doctor: {
    name: "",
    email: "",
    contactNumber: "",
    gender: "",
    registrationNumber: "",
    experience: 0,
    address: "",
    appointmentFee: 0,
    qualification: "",
    designation: "",
    currentWorkingPlace: "",
  },
};

const DoctorModal = ({ open, setOpen }: TDoctorModalProps) => {
  const [createDoctor] = useCreateDoctorMutation();

  const [error, setError] = useState("");

  const handleFormSubmit = async (values: FieldValues) => {
    values.doctor.experience = Number(values.doctor.experience);
    values.doctor.appointmentFee = Number(values.doctor.appointmentFee);
    const convertedData = convertPayloadToFormData(values);
    try {
      const res = await createDoctor(convertedData).unwrap();
      if (res?.doctor?.id) {
        toast.success("Doctor created successfully");
        setOpen(false);
      }
    } catch (error: any) {
      setError("Something went wrong!");
      console.log(error?.message);
    }
  };

  return (
    <FullScreenModal open={open} setOpen={setOpen} title="Create New Doctor">
      <Form onSubmit={handleFormSubmit} defaultValues={defaultValues}>
        <Grid container spacing={2}>
          <Grid item md={4}>
            <Input name="doctor.name" label="Name" fullWidth />
          </Grid>
          <Grid item md={4}>
            <Input name="doctor.email" label="Email" type="email" fullWidth />
          </Grid>
          <Grid item md={4}>
            <Input name="password" label="Password" type="password" fullWidth />
          </Grid>
          <Grid item md={4}>
            <Input
              name="doctor.contactNumber"
              label="Contact Number"
              fullWidth
            />
          </Grid>
          <Grid item md={4}>
            <Input name="doctor.address" label="Address" fullWidth />
          </Grid>
          <Grid item md={4}>
            <Input
              name="doctor.registrationNumber"
              label="Registration Number"
              fullWidth
            />
          </Grid>
          <Grid item md={4}>
            <Input
              name="doctor.experience"
              label="Experience"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item md={4}>
            <SelectField items={gender} name="doctor.gender" fullWidth />
          </Grid>
          <Grid item md={4}>
            <Input
              name="doctor.appointmentFee"
              label="Appointment Fee"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item md={4}>
            <Input
              name="doctor.qualification"
              label="Qualification"
              fullWidth
            />
          </Grid>
          <Grid item md={4}>
            <Input
              name="doctor.currentWorkingPlace"
              label="Current Working Place"
              fullWidth
            />
          </Grid>
          <Grid item md={4}>
            <Input name="doctor.designation" label="Designation" fullWidth />
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="end" mt={3}>
          <Button sx={{ mt: 1 }} type="submit">
            Create
          </Button>
        </Stack>
      </Form>
    </FullScreenModal>
  );
};

export default DoctorModal;
