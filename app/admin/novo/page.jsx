import NewAdmin from "@/components/admin/AdminNew/NewAdmin";
import Menu from "@/components/admin/Menu/Menu";

export default function Page() {
  return (
    <>
      <Menu current="novo" />
      <NewAdmin />
    </>
  );
}
