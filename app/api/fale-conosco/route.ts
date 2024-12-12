// import { ConventionalResponse } from "@/lib/responses";
// import { PostSchema } from "./schema";
// import { sendContactEmail } from "@/lib/email";
// import { bearerAuthMiddleware } from "@/lib/auth";
// import { EmailSendingError } from "@/lib/errors";

// export const POST = bearerAuthMiddleware(
//   process.env.MAIL_API_SECRET,
//   async (request: Request) => {
//     const body = await request.json();
//     const validatedBody = PostSchema.safeParse(body);

//     if (!validatedBody.success) {
//       return ConventionalResponse.badRequest({
//         error: validatedBody.error.flatten().fieldErrors,
//       });
//     }

//     try {
//       await sendContactEmail(validatedBody.data);
//       return ConventionalResponse.ok({
//         message: "Informações enviadas com sucesso.",
//       });
//     } catch (error) {
//       if (error instanceof EmailSendingError) {
//         return ConventionalResponse.internalServerError({
//           message: "Ocorreu um erro no envio do email.",
//         });
//       }

//       return ConventionalResponse.internalServerError();
//     }
//   }
// );
