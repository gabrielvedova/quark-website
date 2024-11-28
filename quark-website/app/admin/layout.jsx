import { isAdminAuthenticated } from "@/lib/session";
import { redirect } from "next/navigation";
import Menu from "@/components/admin/Menu/Menu";

export default async function Layout({ children }) {
  if (!(await isAdminAuthenticated())) redirect("/login");

  return (
    <div>
      <Menu />
      <div>{children}</div>
    </div>
  );
}
