import Menu from "@/components/admin/Menu/Menu";
import ChangeUsername from "@/components/admin/ChangeUsername/ChangeUsername";

export default function Page() {
  return (
    <>
      <Menu current="meu-perfil" />
      <ChangeUsername />
    </>
  );
}
