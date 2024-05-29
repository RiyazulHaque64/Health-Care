export const login = async (payload: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const token = await res.json();
  return token;
};
