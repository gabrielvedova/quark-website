import Menu from "@/components/admin/Menu/Menu";
import EditPost from "@/components/admin/Blog/EditPost/EditPost";

export default function Page() {
  return (
    <>
      <Menu current="blog" />
      <EditPost />
    </>
  );
}
