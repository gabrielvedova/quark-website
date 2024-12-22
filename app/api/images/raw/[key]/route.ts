import { FileNotFoundError } from "@/lib/errors";
import { getImageBlob } from "@/lib/images";
import { ConventionalResponse } from "@/lib/responses";

export const GET = async (
  request: Request,
  { params }: { params: { key: string } }
) => {
  try {
    const blob = await getImageBlob(params.key);
    return new Response(blob);
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Imagem não encontrada",
      });
    }

    return ConventionalResponse.internalServerError();
  }
};
