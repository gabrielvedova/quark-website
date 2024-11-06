import { deleteSession } from "./session";

export default async function logout() {
  deleteSession();
}
