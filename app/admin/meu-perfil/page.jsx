import Menu from "@/components/admin/Menu/Menu";
import EditAdmin from "@/components/admin/Blog/EditAdmin/EditAdmin";

export default function Page() {
  return (
    <>
      <Menu current="alterar-informacoes" />
      <EditAdmin />
    </>
  );
}
