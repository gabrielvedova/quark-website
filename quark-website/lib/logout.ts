import { deleteSession } from "./session";

export default async function logout() {
  deleteSession();
  return { message: "Logout realizado com sucesso", status: 200 };
}
