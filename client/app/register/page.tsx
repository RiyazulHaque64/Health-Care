"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import assets from "../assets";
import Form from "../components/Forms/Form";
import Input from "../components/Forms/Input";
import { login } from "../services/actions/login";
import { registerPatient } from "../services/actions/registerPatient";
import { storeUserInfo } from "../services/auth.service";
import convertPayloadToFormData from "../utils/convertPayloadToFormData";

const registerFormValidationSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  patient: z.object({
    name: z.string().min(1, { message: "Type your name" }),
    email: z.string().email({ message: "Type your valid email" }),
    contactNumber: z
      .string()
      .regex(/^\d{11}$/, { message: "Type your 11 digits phone number" }),
    address: z.string().min(1, { message: "Type your address" }),
  }),
});

const defaultValues = {
  password: "",
  patient: {
    name: "",
    email: "",
    contactNumber: "",
    address: "",
  },
};

const RegisterPage = () => {
  const router = useRouter();

  const handleSubmit = async (values: FieldValues) => {
    const data = convertPayloadToFormData(values);
    try {
      const patient = await registerPatient(data);
      if (patient?.success) {
        toast.success(patient?.message);
        const token = await login({
          password: values.password,
          email: values.patient.email,
        });
        if (token?.success) {
          if (token?.data?.accessToken) {
            storeUserInfo(token?.data?.accessToken);
            router.push("/");
          }
        }
      } else if (!patient?.success) {
        toast.error(patient?.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <Container>
      <Stack height="100vh" justifyContent="center" alignItems="center">
        <Box maxWidth="600px" px={5} py={6} boxShadow={1}>
          <Stack justifyContent="center" alignItems="center" direction="column">
            <Image
              src={assets.svgs.logo}
              alt="Registration Image"
              width={80}
              height={80}
            />
            <Typography
              variant="h4"
              sx={{ marginTop: "10px", marginBottom: "20px" }}
            >
              Patient Register
            </Typography>
          </Stack>
          <Form
            onSubmit={handleSubmit}
            resolver={zodResolver(registerFormValidationSchema)}
            defaultValues={defaultValues}
          >
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Input
                  name="patient.name"
                  label="Name"
                  type="text"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item md={6}>
                <Input
                  name="patient.email"
                  label="Email"
                  type="text"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item md={6}>
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item md={6}>
                <Input
                  name="patient.contactNumber"
                  label="Contact Number"
                  type="tel"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item md={6}>
                <Input
                  name="patient.address"
                  label="Address"
                  type="text"
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Button fullWidth sx={{ marginTop: "30px" }} type="submit">
              Register
            </Button>
          </Form>
          <Typography component="p" mt={2}>
            Do you already have an account? <Link href="/login">Login</Link>
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default RegisterPage;
