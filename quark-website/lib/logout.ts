import { deleteSession } from "./session";

/**
 * Log out the current user.
 */
export default async function logout() {
  deleteSession();
}
