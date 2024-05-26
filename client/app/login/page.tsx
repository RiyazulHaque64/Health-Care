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
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import assets from "../assets";
import Form from "../components/Forms/Form";
import Input from "../components/Forms/Input";
import { login } from "../services/actions/login";
import { storeUserInfo } from "../services/auth.service";

const loginFormValidationSchema = z.object({
  email: z.string().email({ message: "Please type a valid email" }),
  password: z.string().min(6, { message: "Password must be 6 character" }),
});

const LoginPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (values: FieldValues) => {
    try {
      const res = await login(values);
      if (res?.success) {
        if (res?.data?.accessToken) {
          storeUserInfo(res?.data?.accessToken);
          toast.success(res?.message);
          router.push("/dashboard");
        }
      } else if (!res?.success) {
        setError(res.message);
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
              Login Health Care
            </Typography>
          </Stack>
          {error.length > 1 && (
            <Box
              mb={3}
              p={1}
              textAlign="center"
              sx={{
                backgroundColor: "#ef5350",
                borderRadius: "4px",
              }}
            >
              <Typography color="white">{error}</Typography>
            </Box>
          )}
          <Form
            onSubmit={handleSubmit}
            resolver={zodResolver(loginFormValidationSchema)}
            defaultValues={{
              email: "",
              password: "",
            }}
          >
            <Grid container spacing={2}>
              <Grid item md={6}>
                <Input name="email" label="Email" type="text" fullWidth />
              </Grid>
              <Grid item md={6}>
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Typography component="p" mt={2} textAlign="right">
              Forgot Password?
            </Typography>
            <Button fullWidth sx={{ marginTop: "20px" }} type="submit">
              Login
            </Button>
          </Form>
          <Typography component="p" mt={2}>
            Don&apos;t have an account?{" "}
            <Link href="/register">Create an account</Link>
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default LoginPage;
