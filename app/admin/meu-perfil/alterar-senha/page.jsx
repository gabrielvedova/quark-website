import Menu from "@/components/admin/Menu/Menu";
import ChangePassword from "@/components/admin/ChangePassword/ChangePassword";

export default function Page() {
  return (
    <>
      <Menu current="meu-perfil" />
      <ChangePassword />
    </>
  );
}
