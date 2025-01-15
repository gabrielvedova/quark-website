import Menu from "@/components/admin/Menu/Menu";
import EditHeadline from "@/components/admin/EditHeadline/EditHeadline";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <>
      <Menu current="quark-na-midia" />
      <EditHeadline id={id} />
    </>
  );
}
