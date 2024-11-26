type FormState =
  | { error: { email: string[]; password: string[] } }
  | { message: string };

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data: FormState = await response.json();
  return { status: response.status, ...data };
}
