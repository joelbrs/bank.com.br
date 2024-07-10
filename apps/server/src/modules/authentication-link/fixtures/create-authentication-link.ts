import { randomUUID } from "crypto";
import { getCounter } from "../../../../test/counters";
import { AuthenticationLink, AuthenticationLinkModel } from "..";

export const createAuthenticationLink = (
  args?: Pick<AuthenticationLink, "userTaxId">
): Promise<AuthenticationLink> => {
  const i: number = getCounter("confirmation-link");

  return new AuthenticationLinkModel({
    code: `code#${i}`,
    userTaxId: args?.userTaxId || randomUUID(),
  }).save();
};
