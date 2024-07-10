import { env } from "../config";
import { UserConfirmationTemplate, UserLoginTemplate, resend } from ".";

type SendEmailParams = {
  to: string;
  subject: string;
  template: typeof UserLoginTemplate | typeof UserConfirmationTemplate;
  linkUri: string;
  code: string;
};

export const sendEmail = ({
  template,
  subject,
  to,
  linkUri,
  code,
}: SendEmailParams) => {
  const link = new URL(linkUri, env.API_BASE_URL);
  link.searchParams.set("code", code);
  link.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

  return resend.emails.send({
    from: "Bank <noreply@bank.joelf.tech>",
    to,
    subject,
    react: template({
      email: to,
      link: link.toString(),
    }),
  });
};
