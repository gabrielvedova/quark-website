import { isAdminAuthenticated } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  if (await isAdminAuthenticated()) redirect("/admin");

  return <div>{children}</div>;
}
