"use server";

export const registerPatient = async (formData: FormData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/user/create-patient`,
    {
      method: "POST",
      body: formData,
      cache: "no-store",
    }
  );
  const patientData = await res.json();
  return patientData;
};
