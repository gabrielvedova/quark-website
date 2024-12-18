import Menu from "@/components/admin/Menu/Menu";
import EditAdmin from "@/components/admin/AdminEdit/EditAdmin";

export default function Page() {
  return (
    <>
      <Menu current="meu-perfil" />
      <EditAdmin />
    </>
  );
}
