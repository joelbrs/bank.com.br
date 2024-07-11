import { env } from "../config";
import { UserConfirmationTemplate, UserLoginTemplate, resend } from ".";
import { randomUUID } from "node:crypto";

type SendEmailParams = {
  to: string;
  subject: string;
  template: typeof UserLoginTemplate | typeof UserConfirmationTemplate;
  linkUri: string;
};

export const sendEmail = async ({
  template,
  subject,
  to,
  linkUri,
}: SendEmailParams) => {
  const code = randomUUID();

  const link = new URL(linkUri, env.API_BASE_URL);
  link.searchParams.set("code", code);
  link.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

  await resend.emails.send({
    from: "Bank <noreply@bank-woovi.joelf.tech>",
    to,
    subject,
    react: template({
      email: to,
      link: link.toString(),
    }),
  });

  return {
    code,
  };
};
