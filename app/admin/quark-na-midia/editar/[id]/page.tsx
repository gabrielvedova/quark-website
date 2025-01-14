import Menu from "@/components/admin/Menu/Menu";
import EditHeadline from "@/components/admin/QuarkNaMidia/EditHeadline/EditHeadline";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <>
      <Menu current="quark-na-midia" />
      <EditHeadline id={id} />
    </>
  );
}
