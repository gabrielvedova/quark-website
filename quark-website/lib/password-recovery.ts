import { randomBytes } from "crypto";
import prisma from "./db";
import { sendRecoveryEmail } from "./email";

function generateCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
}

async function deleteExpiredCodes() {
  await prisma.passwordRecoveryCode.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}

async function deletePreviousCodes(email: string) {
  await prisma.passwordRecoveryCode.deleteMany({ where: { email } });
}

export async function initiatePasswordRecovery(email: string) {
  await deleteExpiredCodes();

  const user = await prisma.admin.findUnique({ where: { email } });
  if (!user) throw new Error("Not found");
  if (user.recoveryAttemptsRemaining === 0) throw new Error("Unauthorized");

  const code = generateCode();
  const expiration = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await deletePreviousCodes(email);

  await prisma.passwordRecoveryCode.create({
    data: { email, code, expiresAt: expiration },
  });

  const result = await sendRecoveryEmail({ email, code });

  if (result.accepted.length === 0) {
    throw new Error("Failed to send email");
  }
}
