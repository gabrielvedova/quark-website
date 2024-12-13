import NewAdmin from "@/components/admin/Blog/NewAdmin/NewAdmin";
import Menu from "@/components/admin/Menu/Menu";

export default function Page() {
  return (
    <>
      <Menu current="criar" />
      <NewAdmin />
    </>
  );
}
