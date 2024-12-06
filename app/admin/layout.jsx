import { isAdminAuthenticated } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  if (!(await isAdminAuthenticated())) redirect("/login");

  return <div>{children}</div>;
}
