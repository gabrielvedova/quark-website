type FormState =
  | { error: { email: string[]; password: string[] } }
  | { message: string };

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log({ email, password });

  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  console.log(response);

  const data: FormState = await response.json();

  console.log(data);

  return { status: response.status, ...data };
}
