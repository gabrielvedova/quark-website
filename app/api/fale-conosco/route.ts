import { ConventionalResponse } from "@/lib/responses";
import { PostSchema } from "./schema";
import { sendContactEmail } from "@/lib/email";
import { EmailSendingError } from "@/lib/errors";
import { isRateLimited } from "@/lib/rate-limiter";

const ANSWER_LIMIT_PER_MINUTE = 1;

export const OPTIONS = async () => {
  return ConventionalResponse.ok({ data: { methods: ["POST"] } });
};

export const POST = async (request: Request) => {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  if (isRateLimited(clientIp, ANSWER_LIMIT_PER_MINUTE)) {
    return ConventionalResponse.tooManyRequests();
  }

  const body = await request.json();
  const validatedBody = PostSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    await sendContactEmail(validatedBody.data);
    return ConventionalResponse.ok({
      message: "Informações enviadas com sucesso.",
    });
  } catch (error) {
    if (error instanceof EmailSendingError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro no envio do email.",
      });
    }

    return ConventionalResponse.internalServerError();
  }
};
