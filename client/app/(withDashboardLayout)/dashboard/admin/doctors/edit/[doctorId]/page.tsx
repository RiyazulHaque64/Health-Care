"use client";

import Form from "@/app/components/Forms/Form";
import Input from "@/app/components/Forms/Input";
import SelectField from "@/app/components/Forms/SelectField";
import { gender } from "@/app/constants/common";
import {
  useGetSingleDoctorQuery,
  useUpdateDoctorMutation,
} from "@/app/redux/api/doctorsApi";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

type TDoctorUpdatePageProps = {
  params: {
    doctorId: string;
  };
};

const DoctorUpdatePage = ({ params }: TDoctorUpdatePageProps) => {
  const { data, isLoading } = useGetSingleDoctorQuery(params?.doctorId);
  const [updateDoctor] = useUpdateDoctorMutation();

  const router = useRouter();

  const handleFormSubmit = async (values: FieldValues) => {
    values.experience = Number(values.experience);
    values.appointmentFee = Number(values.appointmentFee);
    try {
      const res = await updateDoctor({
        id: params?.doctorId,
        data: values,
      }).unwrap();
      if (res?.id) {
        toast.success("Doctor updated successfully");
        router.push("/dashboard/admin/doctors");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
      console.log(error?.message);
    }
  };

  const defaultValues = {
    name: data?.name || "",
    email: data?.email || "",
    contactNumber: data?.contactNumber || "",
    gender: data?.gender || "",
    registrationNumber: data?.registrationNumber || "",
    experience: data?.experience || 0,
    address: data?.address || "",
    appointmentFee: data?.appointmentFee || 0,
    qualification: data?.qualification || "",
    designation: data?.designation || "",
    currentWorkingPlace: data?.currentWorkingPlace || "",
  };

  return (
    <Box>
      <Typography variant="h5" component="h5" sx={{ mb: "20px" }}>
        Update Doctor Information
      </Typography>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Form onSubmit={handleFormSubmit} defaultValues={data && defaultValues}>
          <Grid container spacing={2}>
            <Grid item md={4}>
              <Input name="name" label="Name" fullWidth />
            </Grid>
            <Grid item md={4}>
              <Input name="email" label="Email" type="email" fullWidth />
            </Grid>
            <Grid item md={4}>
              <Input name="contactNumber" label="Contact Number" fullWidth />
            </Grid>
            <Grid item md={4}>
              <Input name="address" label="Address" fullWidth />
            </Grid>
            <Grid item md={4}>
              <Input
                name="registrationNumber"
                label="Registration Number"
                fullWidth
              />
            </Grid>
            <Grid item md={4}>
              <Input
                name="experience"
                label="Experience"
                type="number"
                fullWidth
              />
            </Grid>
            <Grid item md={4}>
              <SelectField
                items={gender}
                name="gender"
                label="Gender"
                fullWidth
              />
            </Grid>
            <Grid item md={4}>
              <Input
                name="appointmentFee"
                label="Appointment Fee"
                type="number"
                fullWidth
              />
            </Grid>
            <Grid item md={4}>
              <Input name="qualification" label="Qualification" fullWidth />
            </Grid>
            <Grid item md={4}>
              <Input
                name="currentWorkingPlace"
                label="Current Working Place"
                fullWidth
              />
            </Grid>
            <Grid item md={4}>
              <Input name="designation" label="Designation" fullWidth />
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="end" mt={3}>
            <Button sx={{ mt: 1 }} type="submit">
              Update
            </Button>
          </Stack>
        </Form>
      )}
    </Box>
  );
};

export default DoctorUpdatePage;
