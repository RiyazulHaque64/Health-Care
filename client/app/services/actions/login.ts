import { ILoginFormData } from "@/app/login/page";

export const login = async (payload: ILoginFormData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
    },
    body: JSON.stringify(payload),
  });
  const token = await res.json();
  return token;
};
