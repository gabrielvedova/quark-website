import NewAdmin from "@/components/admin/NewAdmin/NewAdmin";
import Menu from "@/components/admin/Menu/Menu";

export default function Page() {
  return (
    <>
      <Menu current="novo" />
      <NewAdmin />
    </>
  );
}
